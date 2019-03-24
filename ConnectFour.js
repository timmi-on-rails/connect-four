/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2019
 * @compiler Bridge.NET 17.7.0
 */
Bridge.assembly("ConnectFour", function ($asm, globals) {
    "use strict";

    Bridge.define("ConnectFour.Board", {
        statics: {
            fields: {
                COLOR_PLAYER_1: null,
                COLOR_PLAYER_2: null,
                COLOR_RASTER: null,
                COLOR_CHIP_BACKGROUND: null
            },
            ctors: {
                init: function () {
                    this.COLOR_PLAYER_1 = "#BAC8D3";
                    this.COLOR_PLAYER_2 = "#F0A30A";
                    this.COLOR_RASTER = "#FFE74D";
                    this.COLOR_CHIP_BACKGROUND = "white";
                }
            }
        },
        fields: {
            canvas: null,
            imageController1: null,
            imageController2: null,
            loadedImageController1: null,
            loadedImageController2: null,
            Root: null
        },
        events: {
            ColorChanged: null,
            ColumnSelected: null
        },
        ctors: {
            init: function () {
                this.loadedImageController1 = new System.Threading.Tasks.TaskCompletionSource();
                this.loadedImageController2 = new System.Threading.Tasks.TaskCompletionSource();
            },
            ctor: function () {
                this.$initialize();
                this.canvas = document.createElement("canvas");

                var divElement = document.createElement("div");

                divElement.style.marginLeft = "10px";

                var createButton = Bridge.fn.bind(this, function (columnIndex) {
                    var $t;
                    var button = ($t = new Image(), $t.onclick = Bridge.fn.bind(this, function (_) {
                        !Bridge.staticEquals(this.ColumnSelected, null) ? this.ColumnSelected(columnIndex) : null;
                    }), $t);
                    button.style.width = "50px";
                    button.style.height = "50px";
                    button.style.marginRight = "10px";
                    button.style.marginBottom = "10px";
                    this.addColorChanged(function (c) {
                        button.style.background = c;
                    });

                    return button;
                });

                divElement.appendChild(createButton(0));
                divElement.appendChild(createButton(1));
                divElement.appendChild(createButton(2));
                divElement.appendChild(createButton(3));
                divElement.appendChild(createButton(4));
                divElement.appendChild(createButton(5));
                divElement.appendChild(createButton(6));

                this.Root = document.createElement("div");
                this.Root.appendChild(divElement);
                this.Root.appendChild(this.canvas);

                this.imageController1 = new Image();
                this.imageController1.onload = Bridge.fn.bind(this, function (_) {
                    this.loadedImageController1.setResult(0);
                });
                this.imageController1.src = "chip1.svg";

                this.imageController2 = new Image();
                this.imageController2.onload = Bridge.fn.bind(this, function (_) {
                    this.loadedImageController2.setResult(0);
                });
                this.imageController2.src = "chip2.svg";
            }
        },
        methods: {
            Paint: function (game) {
                var $step = 0,
                    $task1, 
                    $taskResult1, 
                    $task2, 
                    $taskResult2, 
                    $jumpFromFinally, 
                    $tcs = new System.Threading.Tasks.TaskCompletionSource(), 
                    $returnValue, 
                    ctx, 
                    $async_e, 
                    $asyncBody = Bridge.fn.bind(this, function () {
                        try {
                            for (;;) {
                                $step = System.Array.min([0,1,2], $step);
                                switch ($step) {
                                    case 0: {
                                        $task1 = this.loadedImageController1.task;
                                        $step = 1;
                                        $task1.continueWith($asyncBody);
                                        return;
                                    }
                                    case 1: {
                                        $taskResult1 = $task1.getAwaitedResult();
                                        $task2 = this.loadedImageController2.task;
                                        $step = 2;
                                        $task2.continueWith($asyncBody);
                                        return;
                                    }
                                    case 2: {
                                        $taskResult2 = $task2.getAwaitedResult();
                                        !Bridge.staticEquals(this.ColorChanged, null) ? this.ColorChanged(game.CurrentChip === ConnectFour.Game.Chip.Mouse ? ConnectFour.Board.COLOR_PLAYER_1 : ConnectFour.Board.COLOR_PLAYER_2) : null;

                                        ctx = this.canvas.getContext("2d");

                                        this.canvas.width = (Bridge.Int.mul(System.Array.getLength(game.Chips, 1), 60) + 10) | 0;
                                        this.canvas.height = (Bridge.Int.mul(System.Array.getLength(game.Chips, 0), 60) + 10) | 0;

                                        ctx.fillStyle = ConnectFour.Board.COLOR_RASTER;
                                        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                                        for (var row = 0; row < System.Array.getLength(game.Chips, 0); row = (row + 1) | 0) {
                                            for (var col = 0; col < System.Array.getLength(game.Chips, 1); col = (col + 1) | 0) {
                                                if (System.Nullable.eq(game.Chips.get([row, col]), ConnectFour.Game.Chip.Mouse)) {
                                                    ctx.drawImage(this.imageController1, ((10 + Bridge.Int.mul(col, 60)) | 0), ((10 + Bridge.Int.mul(row, 60)) | 0), 50.0, 50.0);
                                                } else if (System.Nullable.eq(game.Chips.get([row, col]), ConnectFour.Game.Chip.Cat)) {
                                                    ctx.drawImage(this.imageController2, ((10 + Bridge.Int.mul(col, 60)) | 0), ((10 + Bridge.Int.mul(row, 60)) | 0), 50.0, 50.0);
                                                } else {
                                                    ctx.beginPath();
                                                    ctx.fillStyle = ConnectFour.Board.COLOR_CHIP_BACKGROUND;
                                                    ctx.ellipse(((35 + Bridge.Int.mul(col, 60)) | 0), ((35 + Bridge.Int.mul(row, 60)) | 0), 25, 25, 0, 0, 6.2831853071795862);
                                                    ctx.fill();
                                                }
                                            }
                                        }
                                        $tcs.setResult(null);
                                        return;
                                    }
                                    default: {
                                        $tcs.setResult(null);
                                        return;
                                    }
                                }
                            }
                        } catch($async_e1) {
                            $async_e = System.Exception.create($async_e1);
                            $tcs.setException($async_e);
                        }
                    }, arguments);

                $asyncBody();
                return $tcs.task;
            }
        }
    });

    Bridge.define("ConnectFour.Game", {
        statics: {
            fields: {
                ROWS: 0,
                COLUMNS: 0,
                WIN: 0
            },
            ctors: {
                init: function () {
                    this.ROWS = 6;
                    this.COLUMNS = 7;
                    this.WIN = 4;
                }
            }
        },
        fields: {
            CurrentChip: 0,
            Chips: null,
            Controller1: null,
            Controller2: null
        },
        events: {
            GameUpdated: null
        },
        ctors: {
            init: function () {
                this.CurrentChip = ConnectFour.Game.Chip.Mouse;
                this.Chips = System.Array.create(null, null, System.Nullable$1(ConnectFour.Game.Chip), 6, 7);
            }
        },
        methods: {
            Run: function () {
                var $step = 0,
                    $task1, 
                    $task2, 
                    $taskResult2, 
                    $task3, 
                    $taskResult3, 
                    $jumpFromFinally, 
                    $tcs = new System.Threading.Tasks.TaskCompletionSource(), 
                    $returnValue, 
                    moves, 
                    selectedMove, 
                    $taskResult1, 
                    $async_e, 
                    $asyncBody = Bridge.fn.bind(this, function () {
                        try {
                            for (;;) {
                                $step = System.Array.min([1,2,3,4,5,6,7,8], $step);
                                switch ($step) {

                                    case 1: {
                                        if ( true ) {
                                            $step = 2;
                                            continue;
                                        } 
                                        $step = 8;
                                        continue;
                                    }
                                    case 2: {
                                        !Bridge.staticEquals(this.GameUpdated, null) ? this.GameUpdated(this) : null;

                                        moves = new (System.Collections.Generic.List$1(ConnectFour.Game.Move)).ctor();
                                        for (var i = 0; i < ConnectFour.Game.COLUMNS; i = (i + 1) | 0) {
                                            if (!System.Nullable.hasValue(this.Chips.get([0, i]))) {
                                                moves.add(new ConnectFour.Game.Move(i));
                                            }
                                        }

                                        if (this.CurrentChip === ConnectFour.Game.Chip.Mouse) {
                                            $step = 3;
                                            continue;
                                        }  else {
                                            $step = 5;
                                            continue;
                                        }
                                    }
                                    case 3: {
                                        $task2 = this.Controller1.ConnectFour$IController$Select(this, moves);
                                        $step = 4;
                                        $task2.continueWith($asyncBody);
                                        return;
                                    }
                                    case 4: {
                                        $taskResult2 = $task2.getAwaitedResult();
                                        $taskResult1 = $taskResult2;
                                        $step = 7;
                                        continue;
                                    }
                                    case 5: {
                                        $task3 = this.Controller2.ConnectFour$IController$Select(this, moves);
                                        $step = 6;
                                        $task3.continueWith($asyncBody);
                                        return;
                                    }
                                    case 6: {
                                        $taskResult3 = $task3.getAwaitedResult();
                                        $taskResult1 = $taskResult3;
                                        $step = 7;
                                        continue;
                                    }
                                    case 7: {
                                        selectedMove = ($taskResult1);

                                        if (this.MoveAndCheckForWin(selectedMove)) {
                                            !Bridge.staticEquals(this.GameUpdated, null) ? this.GameUpdated(this) : null;
                                            window.setTimeout(Bridge.fn.bind(this, function () {
                                                window.alert(System.String.format("{0} wins!", [Bridge.box(this.CurrentChip, ConnectFour.Game.Chip, System.Enum.toStringFn(ConnectFour.Game.Chip))]));
                                            }));

                                            $step = 8;
                                            continue;
                                        }

                                        this.CurrentChip = (this.CurrentChip === ConnectFour.Game.Chip.Mouse ? ConnectFour.Game.Chip.Cat : ConnectFour.Game.Chip.Mouse);

                                        $step = 1;
                                        continue;
                                    }
                                    case 8: {
                                        $tcs.setResult(null);
                                        return;
                                    }
                                    default: {
                                        $tcs.setResult(null);
                                        return;
                                    }
                                }
                            }
                        } catch($async_e1) {
                            $async_e = System.Exception.create($async_e1);
                            $tcs.setException($async_e);
                        }
                    }, arguments);

                $asyncBody();
                return $tcs.task;
            },
            MoveAndCheckForWin: function (m) {
                var i;
                for (i = 0; i < ConnectFour.Game.ROWS; i = (i + 1) | 0) {
                    if (System.Nullable.hasValue(this.Chips.get([i, m.ColumnIndex]))) {
                        break;
                    }
                }
                this.Chips.set([((i - 1) | 0), m.ColumnIndex], this.CurrentChip);
                var row = (i - 1) | 0;
                var col = m.ColumnIndex;

                return this.CheckAxis(row, col, 0, 1) || this.CheckAxis(row, col, 1, 0) || this.CheckAxis(row, col, 1, 1) || this.CheckAxis(row, col, 1, -1);
            },
            CheckAxis: function (row, col, drow, dcol) {
                var CheckOneSide = null;
                CheckOneSide = Bridge.fn.bind(this, function (drow2, dcol2) {
                    var c = 0;
                    for (var i = 1; i < ConnectFour.Game.WIN; i = (i + 1) | 0) {
                        if (((col + Bridge.Int.mul(i, dcol2)) | 0) >= 0 && ((col + Bridge.Int.mul(i, dcol2)) | 0) < ConnectFour.Game.COLUMNS && ((row + Bridge.Int.mul(i, drow2)) | 0) >= 0 && ((row + Bridge.Int.mul(i, drow2)) | 0) < ConnectFour.Game.ROWS && System.Nullable.eq(this.Chips.get([((row + Bridge.Int.mul(i, drow2)) | 0), ((col + Bridge.Int.mul(i, dcol2)) | 0)]), this.CurrentChip)) {
                            c = (c + 1) | 0;
                        } else {
                            break;
                        }
                    }
                    return c;
                });
                return ((((CheckOneSide(drow, dcol) + CheckOneSide(((-drow) | 0), ((-dcol) | 0))) | 0) + 1) | 0) >= ConnectFour.Game.WIN;


            }
        }
    });

    Bridge.define("ConnectFour.Game.Chip", {
        $kind: "nested enum",
        statics: {
            fields: {
                Mouse: 0,
                Cat: 1
            }
        }
    });

    Bridge.define("ConnectFour.Game.Move", {
        $kind: "nested class",
        fields: {
            ColumnIndex: 0
        },
        ctors: {
            ctor: function (columnIndex) {
                this.$initialize();
                this.ColumnIndex = columnIndex;
            }
        }
    });

    Bridge.define("ConnectFour.IController", {
        $kind: "interface"
    });

    Bridge.define("ConnectFour.Program", {
        main: function Main () {
            var $t;
            System.Console.WriteLine(System.String.format("Version: {0}", [ConnectFour.Version.Info]));

            var board = new ConnectFour.Board();
            document.body.appendChild(board.Root);

            var game = ($t = new ConnectFour.Game(), $t.Controller1 = new ConnectFour.HumanController(board), $t.Controller2 = new ConnectFour.HumanController(board), $t);

            game.addGameUpdated(function (g) {
                var $step = 0,
                    $task1, 
                    $jumpFromFinally, 
                    $asyncBody = Bridge.fn.bind(this, function () {
                        for (;;) {
                            $step = System.Array.min([0,1], $step);
                            switch ($step) {
                                case 0: {
                                    $task1 = board.Paint(g);
                                    $step = 1;
                                    $task1.continueWith($asyncBody, true);
                                    return;
                                }
                                case 1: {
                                    $task1.getAwaitedResult();
                                    return;
                                }
                                default: {
                                    return;
                                }
                            }
                        }
                    }, arguments);

                $asyncBody();
            });
            Bridge["Bridge._"] = game.Run();
        }
    });

    Bridge.define("ConnectFour.Version", {
        statics: {
            fields: {
                Info: null
            },
            ctors: {
                init: function () {
                    this.Info = "1.0.11";
                }
            }
        }
    });

    Bridge.define("ConnectFour.HumanController", {
        inherits: [ConnectFour.IController],
        fields: {
            board: null
        },
        alias: ["Select", "ConnectFour$IController$Select"],
        ctors: {
            ctor: function (board) {
                this.$initialize();
                this.board = board;
            }
        },
        methods: {
            Select: function (game, allowedMoves) {
                var $step = 0,
                    $task1, 
                    $taskResult1, 
                    $jumpFromFinally, 
                    $tcs = new System.Threading.Tasks.TaskCompletionSource(), 
                    $returnValue, 
                    taskCompletionSource, 
                    columnSelectedHandler, 
                    selectedMove, 
                    selectedColumnIndex, 
                    $async_e, 
                    $asyncBody = Bridge.fn.bind(this, function () {
                        try {
                            for (;;) {
                                $step = System.Array.min([0,1,2,3,4], $step);
                                switch ($step) {
                                    case 0: {
                                        taskCompletionSource = null;

                                        columnSelectedHandler = function (columnIndex) {
                                            taskCompletionSource.setResult(columnIndex);
                                        };

                                        this.board.addColumnSelected(columnSelectedHandler);

                                        
                                    }
                                    case 1: {
                                        taskCompletionSource = new System.Threading.Tasks.TaskCompletionSource();
                                        $task1 = taskCompletionSource.task;
                                        $step = 2;
                                        $task1.continueWith($asyncBody);
                                        return;
                                    }
                                    case 2: {
                                        $taskResult1 = $task1.getAwaitedResult();
                                        selectedColumnIndex = { v : $taskResult1 };
                                        selectedMove = System.Linq.Enumerable.from(allowedMoves).singleOrDefault((function ($me, selectedColumnIndex) {
                                            return function (move) {
                                                return move.ColumnIndex === selectedColumnIndex.v;
                                            };
                                        })(this, selectedColumnIndex), null);
                                        $step = 3;
                                        continue;
                                    }
                                    case 3: {
                                        if ( selectedMove == null ) {

                                            $step = 1;
                                            continue;
                                        }
                                        $step = 4;
                                        continue;
                                    }
                                    case 4: {
                                        this.board.removeColumnSelected(columnSelectedHandler);

                                        $tcs.setResult(selectedMove);
                                        return;
                                    }
                                    default: {
                                        $tcs.setResult(null);
                                        return;
                                    }
                                }
                            }
                        } catch($async_e1) {
                            $async_e = System.Exception.create($async_e1);
                            $tcs.setException($async_e);
                        }
                    }, arguments);

                $asyncBody();
                return $tcs.task;
            }
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDb25uZWN0Rm91ci5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiQm9hcmQuY3MiLCJHYW1lLmNzIiwiUHJvZ3JhbS5jcyIsIkh1bWFuQ29udHJvbGxlci5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzhDQW9Cc0VBLElBQUlBOzhDQUNKQSxJQUFJQTs7OztnQkFVdkVBLGNBQVNBOztnQkFFVEEsaUJBQWlCQTs7Z0JBRWpCQTs7Z0JBRUFBLG1CQUEyQ0EsK0JBQUNBOztvQkFFM0NBLGFBQWFBLGdDQUVGQSwrQkFBQ0E7d0JBQVFBLDBDQUFnQkEsUUFBS0EsQUFBcUNBLG9CQUFzQkEsZUFBY0E7O29CQUVsSEE7b0JBQ0FBO29CQUNBQTtvQkFDQUE7b0JBQ0FBLHFCQUFnQkEsVUFBQ0E7d0JBQU1BLDBCQUEwQkE7OztvQkFFakRBLE9BQU9BOzs7Z0JBR1JBLHVCQUF1QkE7Z0JBQ3ZCQSx1QkFBdUJBO2dCQUN2QkEsdUJBQXVCQTtnQkFDdkJBLHVCQUF1QkE7Z0JBQ3ZCQSx1QkFBdUJBO2dCQUN2QkEsdUJBQXVCQTtnQkFDdkJBLHVCQUF1QkE7O2dCQUV2QkEsWUFBT0E7Z0JBQ1BBLHNCQUFpQkE7Z0JBQ2pCQSxzQkFBaUJBOztnQkFFakJBLHdCQUFtQkE7Z0JBQ25CQSwrQkFBMEJBLCtCQUFDQTtvQkFBTUE7O2dCQUNqQ0E7O2dCQUVBQSx3QkFBbUJBO2dCQUNuQkEsK0JBQTBCQSwrQkFBQ0E7b0JBQU1BOztnQkFDakNBOzs7OzZCQUd1QkE7Ozs7Ozs7Ozs7Ozs7Ozs7O3dDQUV2QkEsU0FBTUE7Ozs7Ozs7d0NBQ05BLFNBQU1BOzs7Ozs7O3dDQUVOQSx3Q0FBY0EsUUFBS0EsQUFBcUNBLGtCQUFvQkEscUJBQW9CQSw4QkFBa0JBLG1DQUFpQkEsb0NBQWlCQTs7d0NBRXBKQSxNQUFVQSxBQUEwQkE7O3dDQUVwQ0Esb0JBQWVBO3dDQUNm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QUFXQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O3dDQUU5Q0EsdUJBQWlEQTs7d0NBRWpEQSx3QkFBbURBLFVBQUNBOzRDQUFvQkEsK0JBQStCQTs7O3dDQUV2R0EsNkJBQXdCQTs7d0NBR3hCQTs7O3dDQUVDQSx1QkFBdUJBLElBQUlBO3dDQUMzQkEsU0FBZ0NBOzs7Ozs7O29FQUFOQTt3Q0FDMUJBLGVBQWVBLDRCQUFrREEsOEJBQWFBLEFBQThCQTs7dURBQVFBLHFCQUFvQkE7Ozs7Ozs7NkNBQ2hJQSxnQkFBZ0JBOzs7Ozs7Ozs7d0NBRXpCQSxnQ0FBd0JBOzt3Q0FFeEJBLGVBQU9BIiwKICAic291cmNlc0NvbnRlbnQiOiBbInVzaW5nIEJyaWRnZS5IdG1sNTtcbnVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XG5cbm5hbWVzcGFjZSBDb25uZWN0Rm91clxue1xuXHRkZWxlZ2F0ZSB2b2lkIENvbHVtblNlbGVjdGVkRXZlbnRIYW5kbGVyKGludCBjb2x1bW5JbmRleCk7XG5cblx0ZGVsZWdhdGUgdm9pZCBDb2xvckNoYW5nZWRFdmVudEhhbmRsZXIoc3RyaW5nIGNvbG9yKTtcblxuXHRjbGFzcyBCb2FyZFxuXHR7XG5cdFx0cHJpdmF0ZSBjb25zdCBzdHJpbmcgQ09MT1JfUExBWUVSXzEgPSBcIiNCQUM4RDNcIjtcblx0XHRwcml2YXRlIGNvbnN0IHN0cmluZyBDT0xPUl9QTEFZRVJfMiA9IFwiI0YwQTMwQVwiO1xuXHRcdHByaXZhdGUgY29uc3Qgc3RyaW5nIENPTE9SX1JBU1RFUiA9IFwiI0ZGRTc0RFwiO1xuXHRcdHByaXZhdGUgY29uc3Qgc3RyaW5nIENPTE9SX0NISVBfQkFDS0dST1VORCA9IFwid2hpdGVcIjtcblxuXHRcdHByaXZhdGUgcmVhZG9ubHkgSFRNTENhbnZhc0VsZW1lbnQgY2FudmFzO1xuXHRcdHByaXZhdGUgcmVhZG9ubHkgSFRNTEltYWdlRWxlbWVudCBpbWFnZUNvbnRyb2xsZXIxO1xuXHRcdHByaXZhdGUgcmVhZG9ubHkgSFRNTEltYWdlRWxlbWVudCBpbWFnZUNvbnRyb2xsZXIyO1xuXHRcdHByaXZhdGUgcmVhZG9ubHkgVGFza0NvbXBsZXRpb25Tb3VyY2U8aW50PiBsb2FkZWRJbWFnZUNvbnRyb2xsZXIxID0gbmV3IFRhc2tDb21wbGV0aW9uU291cmNlPGludD4oKTtcblx0XHRwcml2YXRlIHJlYWRvbmx5IFRhc2tDb21wbGV0aW9uU291cmNlPGludD4gbG9hZGVkSW1hZ2VDb250cm9sbGVyMiA9IG5ldyBUYXNrQ29tcGxldGlvblNvdXJjZTxpbnQ+KCk7XG5cblx0XHRwcml2YXRlIGV2ZW50IENvbG9yQ2hhbmdlZEV2ZW50SGFuZGxlciBDb2xvckNoYW5nZWQ7XG5cblx0XHRwdWJsaWMgZXZlbnQgQ29sdW1uU2VsZWN0ZWRFdmVudEhhbmRsZXIgQ29sdW1uU2VsZWN0ZWQ7XG5cblx0XHRwdWJsaWMgTm9kZSBSb290IHsgZ2V0OyBwcml2YXRlIHNldDsgfVxuXG5cdFx0cHVibGljIEJvYXJkKClcblx0XHR7XG5cdFx0XHRjYW52YXMgPSBuZXcgSFRNTENhbnZhc0VsZW1lbnQoKTtcblxuXHRcdFx0dmFyIGRpdkVsZW1lbnQgPSBuZXcgSFRNTERpdkVsZW1lbnQoKTtcblxuXHRcdFx0ZGl2RWxlbWVudC5TdHlsZS5NYXJnaW5MZWZ0ID0gXCIxMHB4XCI7XG5cblx0XHRcdEZ1bmM8aW50LCBIVE1MSW1hZ2VFbGVtZW50PiBjcmVhdGVCdXR0b24gPSAoaW50IGNvbHVtbkluZGV4KSA9PlxuXHRcdFx0e1xuXHRcdFx0XHR2YXIgYnV0dG9uID0gbmV3IEhUTUxJbWFnZUVsZW1lbnRcblx0XHRcdFx0e1xuXHRcdFx0XHRcdE9uQ2xpY2sgPSAoXykgPT4geyBDb2x1bW5TZWxlY3RlZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+Q29sdW1uU2VsZWN0ZWQuSW52b2tlKGNvbHVtbkluZGV4KSk6bnVsbDsgfVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRidXR0b24uU3R5bGUuV2lkdGggPSBcIjUwcHhcIjtcblx0XHRcdFx0YnV0dG9uLlN0eWxlLkhlaWdodCA9IFwiNTBweFwiO1xuXHRcdFx0XHRidXR0b24uU3R5bGUuTWFyZ2luUmlnaHQgPSBcIjEwcHhcIjtcblx0XHRcdFx0YnV0dG9uLlN0eWxlLk1hcmdpbkJvdHRvbSA9IFwiMTBweFwiO1xuXHRcdFx0XHRDb2xvckNoYW5nZWQgKz0gKGMpID0+IGJ1dHRvbi5TdHlsZS5CYWNrZ3JvdW5kID0gYztcblxuXHRcdFx0XHRyZXR1cm4gYnV0dG9uO1xuXHRcdFx0fTtcblxuXHRcdFx0ZGl2RWxlbWVudC5BcHBlbmRDaGlsZChjcmVhdGVCdXR0b24oMCkpO1xuXHRcdFx0ZGl2RWxlbWVudC5BcHBlbmRDaGlsZChjcmVhdGVCdXR0b24oMSkpO1xuXHRcdFx0ZGl2RWxlbWVudC5BcHBlbmRDaGlsZChjcmVhdGVCdXR0b24oMikpO1xuXHRcdFx0ZGl2RWxlbWVudC5BcHBlbmRDaGlsZChjcmVhdGVCdXR0b24oMykpO1xuXHRcdFx0ZGl2RWxlbWVudC5BcHBlbmRDaGlsZChjcmVhdGVCdXR0b24oNCkpO1xuXHRcdFx0ZGl2RWxlbWVudC5BcHBlbmRDaGlsZChjcmVhdGVCdXR0b24oNSkpO1xuXHRcdFx0ZGl2RWxlbWVudC5BcHBlbmRDaGlsZChjcmVhdGVCdXR0b24oNikpO1xuXG5cdFx0XHRSb290ID0gbmV3IEhUTUxEaXZFbGVtZW50KCk7XG5cdFx0XHRSb290LkFwcGVuZENoaWxkKGRpdkVsZW1lbnQpO1xuXHRcdFx0Um9vdC5BcHBlbmRDaGlsZChjYW52YXMpO1xuXG5cdFx0XHRpbWFnZUNvbnRyb2xsZXIxID0gbmV3IEhUTUxJbWFnZUVsZW1lbnQoKTtcblx0XHRcdGltYWdlQ29udHJvbGxlcjEuT25Mb2FkID0gKF8pID0+IGxvYWRlZEltYWdlQ29udHJvbGxlcjEuU2V0UmVzdWx0KDApO1xuXHRcdFx0aW1hZ2VDb250cm9sbGVyMS5TcmMgPSBcImNoaXAxLnN2Z1wiO1xuXG5cdFx0XHRpbWFnZUNvbnRyb2xsZXIyID0gbmV3IEhUTUxJbWFnZUVsZW1lbnQoKTtcblx0XHRcdGltYWdlQ29udHJvbGxlcjIuT25Mb2FkID0gKF8pID0+IGxvYWRlZEltYWdlQ29udHJvbGxlcjIuU2V0UmVzdWx0KDApO1xuXHRcdFx0aW1hZ2VDb250cm9sbGVyMi5TcmMgPSBcImNoaXAyLnN2Z1wiO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBhc3luYyBUYXNrIFBhaW50KEdhbWUgZ2FtZSlcblx0XHR7XG5cdFx0XHRhd2FpdCBsb2FkZWRJbWFnZUNvbnRyb2xsZXIxLlRhc2s7XG5cdFx0XHRhd2FpdCBsb2FkZWRJbWFnZUNvbnRyb2xsZXIyLlRhc2s7XG5cblx0XHRcdENvbG9yQ2hhbmdlZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+Q29sb3JDaGFuZ2VkLkludm9rZShnYW1lLkN1cnJlbnRDaGlwID09IEdhbWUuQ2hpcC5Nb3VzZSA/IENPTE9SX1BMQVlFUl8xIDogQ09MT1JfUExBWUVSXzIpKTpudWxsO1xuXG5cdFx0XHR2YXIgY3R4ID0gKENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCljYW52YXMuR2V0Q29udGV4dChcIjJkXCIpO1xuXG5cdFx0XHRjYW52YXMuV2lkdGggPSBnYW1lLkNoaXBzLkdldExlbmd0aCgxKSAqIDYwICsgMTA7XG5cdFx0XHRjYW52YXMuSGVpZ2h0ID0gZ2FtZS5DaGlwcy5HZXRMZW5ndGgoMCkgKiA2MCArIDEwO1xuXG5cdFx0XHRjdHguRmlsbFN0eWxlID0gQ09MT1JfUkFTVEVSO1xuXHRcdFx0Y3R4LkZpbGxSZWN0KDAsIDAsIGNhbnZhcy5XaWR0aCwgY2FudmFzLkhlaWdodCk7XG5cblx0XHRcdGZvciAoaW50IHJvdyA9IDA7IHJvdyA8IGdhbWUuQ2hpcHMuR2V0TGVuZ3RoKDApOyByb3crKylcblx0XHRcdHtcblx0XHRcdFx0Zm9yIChpbnQgY29sID0gMDsgY29sIDwgZ2FtZS5DaGlwcy5HZXRMZW5ndGgoMSk7IGNvbCsrKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWYgKGdhbWUuQ2hpcHNbcm93LCBjb2xdID09IEdhbWUuQ2hpcC5Nb3VzZSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjdHguRHJhd0ltYWdlKGltYWdlQ29udHJvbGxlcjEsIDEwICsgY29sICogNjAsIDEwICsgcm93ICogNjAsIDUwZCwgNTBkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAoZ2FtZS5DaGlwc1tyb3csIGNvbF0gPT0gR2FtZS5DaGlwLkNhdClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjdHguRHJhd0ltYWdlKGltYWdlQ29udHJvbGxlcjIsIDEwICsgY29sICogNjAsIDEwICsgcm93ICogNjAsIDUwZCwgNTBkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGN0eC5CZWdpblBhdGgoKTtcblx0XHRcdFx0XHRcdGN0eC5GaWxsU3R5bGUgPSBDT0xPUl9DSElQX0JBQ0tHUk9VTkQ7XG5cdFx0XHRcdFx0XHRjdHguRWxsaXBzZSgxMCArIDI1ICsgY29sICogNjAsIDEwICsgMjUgKyByb3cgKiA2MCwgMjUsIDI1LCAwLCAwLCAyICogTWF0aC5QSSk7XG5cdFx0XHRcdFx0XHRjdHguRmlsbCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuIiwidXNpbmcgQnJpZGdlLkh0bWw1O1xudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xuXG5uYW1lc3BhY2UgQ29ubmVjdEZvdXJcbntcblx0ZGVsZWdhdGUgdm9pZCBHYW1lVXBkYXRlZEV2ZW50SGFuZGxlcihHYW1lIGdhbWUpO1xuXG5cdGNsYXNzIEdhbWVcblx0e1xuXHRcdHB1YmxpYyBjb25zdCBpbnQgUk9XUyA9IDY7XG5cdFx0cHVibGljIGNvbnN0IGludCBDT0xVTU5TID0gNztcblx0XHRwcml2YXRlIGNvbnN0IGludCBXSU4gPSA0O1xuXG5cdFx0cHVibGljIGV2ZW50IEdhbWVVcGRhdGVkRXZlbnRIYW5kbGVyIEdhbWVVcGRhdGVkO1xuXG5cdFx0cHVibGljIGVudW0gQ2hpcFxuXHRcdHtcblx0XHRcdE1vdXNlLFxuXHRcdFx0Q2F0XG5cdFx0fVxuXG5cdFx0cHVibGljIENoaXAgQ3VycmVudENoaXAgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcblxuXG5cdFx0cHVibGljIENoaXA/WyxdIENoaXBzIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG5cblxuXHRcdHB1YmxpYyBJQ29udHJvbGxlciBDb250cm9sbGVyMSB7IGdldDsgc2V0OyB9XG5cblx0XHRwdWJsaWMgSUNvbnRyb2xsZXIgQ29udHJvbGxlcjIgeyBnZXQ7IHNldDsgfVxuXG5cdFx0cHVibGljIGFzeW5jIFRhc2sgUnVuKClcblx0XHR7XG5cdFx0XHR3aGlsZSAodHJ1ZSlcblx0XHRcdHtcblx0XHRcdFx0R2FtZVVwZGF0ZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PkdhbWVVcGRhdGVkLkludm9rZSh0aGlzKSk6bnVsbDtcblxuXHRcdFx0XHRMaXN0PE1vdmU+IG1vdmVzID0gbmV3IExpc3Q8TW92ZT4oKTtcblx0XHRcdFx0Zm9yIChpbnQgaSA9IDA7IGkgPCBDT0xVTU5TOyBpKyspXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZiAoIUNoaXBzWzAsIGldLkhhc1ZhbHVlKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdG1vdmVzLkFkZChuZXcgTW92ZShpKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0TW92ZSBzZWxlY3RlZE1vdmUgPSAoQ3VycmVudENoaXAgPT0gQ2hpcC5Nb3VzZSA/IGF3YWl0IENvbnRyb2xsZXIxLlNlbGVjdCh0aGlzLCBtb3ZlcykgOiBhd2FpdCBDb250cm9sbGVyMi5TZWxlY3QodGhpcywgbW92ZXMpKTtcblxuXHRcdFx0XHRpZiAoTW92ZUFuZENoZWNrRm9yV2luKHNlbGVjdGVkTW92ZSkpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRHYW1lVXBkYXRlZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+R2FtZVVwZGF0ZWQuSW52b2tlKHRoaXMpKTpudWxsO1xuXHRcdFx0XHRcdFdpbmRvdy5TZXRUaW1lb3V0KChTeXN0ZW0uQWN0aW9uKSgoKSA9PlxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFdpbmRvdy5BbGVydChzdHJpbmcuRm9ybWF0KFwiezB9IHdpbnMhXCIsQ3VycmVudENoaXApKTtcblx0XHRcdFx0XHR9KSk7XG5cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdEN1cnJlbnRDaGlwID0gKEN1cnJlbnRDaGlwID09IENoaXAuTW91c2UgPyBDaGlwLkNhdCA6IENoaXAuTW91c2UpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHByaXZhdGUgYm9vbCBNb3ZlQW5kQ2hlY2tGb3JXaW4oTW92ZSBtKVxuXHRcdHtcblx0XHRcdGludCBpO1xuXHRcdFx0Zm9yIChpID0gMDsgaSA8IFJPV1M7IGkrKylcblx0XHRcdFx0aWYgKENoaXBzW2ksIG0uQ29sdW1uSW5kZXhdLkhhc1ZhbHVlKVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0Q2hpcHNbaSAtIDEsIG0uQ29sdW1uSW5kZXhdID0gQ3VycmVudENoaXA7XG5cdFx0XHRpbnQgcm93ID0gaSAtIDE7XG5cdFx0XHRpbnQgY29sID0gbS5Db2x1bW5JbmRleDtcblxuXHRcdFx0cmV0dXJuIENoZWNrQXhpcyhyb3csIGNvbCwgMCwgMSlcblx0XHRcdFx0fHwgQ2hlY2tBeGlzKHJvdywgY29sLCAxLCAwKVxuXHRcdFx0XHR8fCBDaGVja0F4aXMocm93LCBjb2wsIDEsIDEpXG5cdFx0XHRcdHx8IENoZWNrQXhpcyhyb3csIGNvbCwgMSwgLTEpO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgYm9vbCBDaGVja0F4aXMoaW50IHJvdywgaW50IGNvbCwgaW50IGRyb3csIGludCBkY29sKVxuXHRcdHtcblN5c3RlbS5GdW5jPGludCwgaW50LCBpbnQ+IENoZWNrT25lU2lkZSA9IG51bGw7XG5DaGVja09uZVNpZGUgPSAoZHJvdzIsIGRjb2wyKSA9PlxyXG57XHJcbiAgICBpbnQgYyA9IDA7XHJcbiAgICBmb3IgKGludCBpID0gMTsgaSA8IFdJTjsgaSsrKVxyXG4gICAgICAgIGlmIChjb2wgKyBpICogZGNvbDIgPj0gMCAmJiBjb2wgKyBpICogZGNvbDIgPCBDT0xVTU5TICYmIHJvdyArIGkgKiBkcm93MiA+PSAwICYmIHJvdyArIGkgKiBkcm93MiA8IFJPV1MgJiYgQ2hpcHNbcm93ICsgaSAqIGRyb3cyLCBjb2wgKyBpICogZGNvbDJdID09IEN1cnJlbnRDaGlwKVxyXG4gICAgICAgICAgICBjKys7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIHJldHVybiBjO1xyXG59XHJcblxyXG47XG5cdFx0XHRyZXR1cm4gQ2hlY2tPbmVTaWRlKGRyb3csIGRjb2wpICsgQ2hlY2tPbmVTaWRlKC1kcm93LCAtZGNvbCkgKyAxID49IFdJTjtcblxuXHRcdFx0XG5cdFx0fVxuXG5cdFx0cHVibGljIGNsYXNzIE1vdmVcblx0XHR7XG5cdFx0XHRwdWJsaWMgaW50IENvbHVtbkluZGV4IHsgZ2V0OyBwcml2YXRlIHNldDsgfVxuXG5cdFx0XHRwdWJsaWMgTW92ZShpbnQgY29sdW1uSW5kZXgpXG5cdFx0XHR7XG5cdFx0XHRcdENvbHVtbkluZGV4ID0gY29sdW1uSW5kZXg7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFxucHJpdmF0ZSBDaGlwIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19DdXJyZW50Q2hpcD1DaGlwLk1vdXNlO3ByaXZhdGUgQ2hpcD9bLF0gX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0NoaXBzPW5ldyBDaGlwP1tST1dTLCBDT0xVTU5TXTt9XG59XG4iLCJ1c2luZyBCcmlkZ2UuSHRtbDU7XG51c2luZyBTeXN0ZW07XG5cbm5hbWVzcGFjZSBDb25uZWN0Rm91clxue1xuXHRwdWJsaWMgY2xhc3MgUHJvZ3JhbVxuXHR7XG5cdFx0cHVibGljIHN0YXRpYyB2b2lkIE1haW4oKVxuXHRcdHtcblx0XHRcdENvbnNvbGUuV3JpdGVMaW5lKHN0cmluZy5Gb3JtYXQoXCJWZXJzaW9uOiB7MH1cIixWZXJzaW9uLkluZm8pKTtcblxuXHRcdFx0Qm9hcmQgYm9hcmQgPSBuZXcgQm9hcmQoKTtcblx0XHRcdERvY3VtZW50LkJvZHkuQXBwZW5kQ2hpbGQoYm9hcmQuUm9vdCk7XG5cblx0XHRcdEdhbWUgZ2FtZSA9IG5ldyBHYW1lXG5cdFx0XHR7XG5cdFx0XHRcdENvbnRyb2xsZXIxID0gbmV3IEh1bWFuQ29udHJvbGxlcihib2FyZCksXG5cdFx0XHRcdENvbnRyb2xsZXIyID0gbmV3IEh1bWFuQ29udHJvbGxlcihib2FyZClcblx0XHRcdH07XG5cblx0XHRcdGdhbWUuR2FtZVVwZGF0ZWQgKz0gYXN5bmMgKGcpID0+IGF3YWl0IGJvYXJkLlBhaW50KGcpO1xuQnJpZGdlLlNjcmlwdC5EaXNjYXJkPSBnYW1lLlJ1bigpO1xuXHRcdH1cblx0fVxufVxuIiwidXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XG51c2luZyBTeXN0ZW0uTGlucTtcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XG5cbm5hbWVzcGFjZSBDb25uZWN0Rm91clxue1xuXHRjbGFzcyBIdW1hbkNvbnRyb2xsZXIgOiBJQ29udHJvbGxlclxuXHR7XG5cdFx0cHJpdmF0ZSByZWFkb25seSBCb2FyZCBib2FyZDtcblxuXHRcdHB1YmxpYyBIdW1hbkNvbnRyb2xsZXIoQm9hcmQgYm9hcmQpXG5cdFx0e1xuXHRcdFx0dGhpcy5ib2FyZCA9IGJvYXJkO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBhc3luYyBUYXNrPEdhbWUuTW92ZT4gU2VsZWN0KEdhbWUgZ2FtZSwgSUVudW1lcmFibGU8R2FtZS5Nb3ZlPiBhbGxvd2VkTW92ZXMpXG5cdFx0e1xuXHRcdFx0VGFza0NvbXBsZXRpb25Tb3VyY2U8aW50PiB0YXNrQ29tcGxldGlvblNvdXJjZSA9IG51bGw7XG5cblx0XHRcdENvbHVtblNlbGVjdGVkRXZlbnRIYW5kbGVyIGNvbHVtblNlbGVjdGVkSGFuZGxlciA9IChpbnQgY29sdW1uSW5kZXgpID0+IHRhc2tDb21wbGV0aW9uU291cmNlLlNldFJlc3VsdChjb2x1bW5JbmRleCk7XG5cblx0XHRcdGJvYXJkLkNvbHVtblNlbGVjdGVkICs9IGNvbHVtblNlbGVjdGVkSGFuZGxlcjtcblxuXHRcdFx0R2FtZS5Nb3ZlIHNlbGVjdGVkTW92ZTtcblx0XHRcdGRvXG5cdFx0XHR7XG5cdFx0XHRcdHRhc2tDb21wbGV0aW9uU291cmNlID0gbmV3IFRhc2tDb21wbGV0aW9uU291cmNlPGludD4oKTtcblx0XHRcdFx0aW50IHNlbGVjdGVkQ29sdW1uSW5kZXggPSBhd2FpdCB0YXNrQ29tcGxldGlvblNvdXJjZS5UYXNrO1xuXHRcdFx0XHRzZWxlY3RlZE1vdmUgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNpbmdsZU9yRGVmYXVsdDxHYW1lLk1vdmU+KGFsbG93ZWRNb3ZlcywoU3lzdGVtLkZ1bmM8R2FtZS5Nb3ZlLGJvb2w+KShtb3ZlID0+IG1vdmUuQ29sdW1uSW5kZXggPT0gc2VsZWN0ZWRDb2x1bW5JbmRleCkpO1xuXHRcdFx0fSB3aGlsZSAoc2VsZWN0ZWRNb3ZlID09IG51bGwpO1xuXG5cdFx0XHRib2FyZC5Db2x1bW5TZWxlY3RlZCAtPSBjb2x1bW5TZWxlY3RlZEhhbmRsZXI7XG5cblx0XHRcdHJldHVybiBzZWxlY3RlZE1vdmU7XG5cdFx0fVxuXHR9XG59XG4iXQp9Cg==
