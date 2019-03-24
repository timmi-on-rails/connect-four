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

                this.canvas.style.position = "absolute";
                this.canvas.style.top = "50%";
                this.canvas.style.left = "50%";
                this.canvas.style.transform = "translate(-50%, -50%)";
                this.canvas.onclick = Bridge.fn.bind(this, function (e) {
                    var x = ((e.pageX - this.canvas.offsetLeft) | 0) + 0.5 * this.canvas.width;
                    var y = ((e.pageY - this.canvas.offsetTop) | 0) + 0.5 * this.canvas.height;

                    System.Console.WriteLine(System.String.format("X: {0}, Y: {1}", Bridge.box(x, System.Double, System.Double.format, System.Double.getHashCode), Bridge.box(y, System.Double, System.Double.format, System.Double.getHashCode)));
                    if (y > 10 && y < 60) {
                        for (var col = 0; col < ConnectFour.Game.COLUMNS; col = (col + 1) | 0) {
                            if (x > ((10 + Bridge.Int.mul(col, 60)) | 0) && x < ((60 + Bridge.Int.mul(col, 60)) | 0)) {
                                !Bridge.staticEquals(this.ColumnSelected, null) ? this.ColumnSelected(col) : null;
                            }
                        }

                    }
                });

                this.Root = this.canvas;

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
                                        ctx = this.canvas.getContext("2d");

                                        this.canvas.width = (Bridge.Int.mul(System.Array.getLength(game.Chips, 1), 60) + 10) | 0;
                                        this.canvas.height = (Bridge.Int.mul((((System.Array.getLength(game.Chips, 0) + 1) | 0)), 60) + 10) | 0;

                                        ctx.fillStyle = ConnectFour.Board.COLOR_RASTER;
                                        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                                        for (var col = 0; col < System.Array.getLength(game.Chips, 1); col = (col + 1) | 0) {
                                            ctx.fillStyle = game.CurrentChip === ConnectFour.Game.Chip.Mouse ? ConnectFour.Board.COLOR_PLAYER_1 : ConnectFour.Board.COLOR_PLAYER_2;
                                            ctx.fillRect(((10 + Bridge.Int.mul(col, 60)) | 0), 10, 50, 50);
                                        }

                                        for (var row = 0; row < System.Array.getLength(game.Chips, 0); row = (row + 1) | 0) {
                                            for (var col1 = 0; col1 < System.Array.getLength(game.Chips, 1); col1 = (col1 + 1) | 0) {
                                                if (System.Nullable.eq(game.Chips.get([row, col1]), ConnectFour.Game.Chip.Mouse)) {
                                                    ctx.drawImage(this.imageController1, ((10 + Bridge.Int.mul(col1, 60)) | 0), ((10 + Bridge.Int.mul((((row + 1) | 0)), 60)) | 0), 50.0, 50.0);
                                                } else if (System.Nullable.eq(game.Chips.get([row, col1]), ConnectFour.Game.Chip.Cat)) {
                                                    ctx.drawImage(this.imageController2, ((10 + Bridge.Int.mul(col1, 60)) | 0), ((10 + Bridge.Int.mul((((row + 1) | 0)), 60)) | 0), 50.0, 50.0);
                                                } else {
                                                    ctx.beginPath();
                                                    ctx.fillStyle = ConnectFour.Board.COLOR_CHIP_BACKGROUND;
                                                    ctx.ellipse(((35 + Bridge.Int.mul(col1, 60)) | 0), ((35 + Bridge.Int.mul((((row + 1) | 0)), 60)) | 0), 25, 25, 0, 0, 6.2831853071795862);
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
            document.body.style.backgroundImage = "url('background.png')";

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
                    this.Info = "1.0.12";
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDb25uZWN0Rm91ci5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiQm9hcmQuY3MiLCJHYW1lLmNzIiwiUHJvZ3JhbS5jcyIsIkh1bWFuQ29udHJvbGxlci5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OENBb0JzRUEsSUFBSUE7OENBQ0pBLElBQUlBOzs7O2dCQVF2RUEsY0FBU0E7O2dCQUVUQSw2QkFBd0JBO2dCQUN4QkE7Z0JBQ0FBO2dCQUNBQTtnQkFDQUEsc0JBQWlCQSwrQkFBQ0E7b0JBRWpCQSxRQUFRQSxZQUFVQSwrQkFBb0JBLE1BQU1BO29CQUM1Q0EsUUFBUUEsWUFBVUEsOEJBQW1CQSxNQUFNQTs7b0JBRTNDQSx5QkFBa0JBLHVDQUErQkEsK0VBQUVBO29CQUNuREEsSUFBSUEsVUFBVUE7d0JBRWJBLEtBQUtBLGFBQWFBLE1BQU1BLDBCQUFjQTs0QkFFckNBLElBQUlBLElBQUlBLE9BQUtBLGlDQUFZQSxJQUFJQSxPQUFLQTtnQ0FFakNBLDBDQUFnQkEsUUFBS0EsQUFBcUNBLG9CQUFzQkEsT0FBTUE7Ozs7Ozs7Z0JBTzFGQSxZQUFPQTs7Z0JBRVBBLHdCQUFtQkE7Z0JBQ25CQSwrQkFBMEJBLCtCQUFDQTtvQkFBTUE7O2dCQUNqQ0E7O2dCQUVBQSx3QkFBbUJBO2dCQUNuQkEsK0JBQTBCQSwrQkFBQ0E7b0JBQU1BOztnQkFDakNBOzs7OzZCQUd1QkE7Ozs7Ozs7Ozs7Ozs7Ozs7O3dDQUV2QkEsU0FBTUE7Ozs7Ozs7d0NBQ05BLFNBQU1BOzs7Ozs7O3dDQUVOQSxNQUFVQSxBQUEwQkE7O3dDQUVwQ0Esb0JBQWVBO3dDQUNmQSxxQkFBZ0JBLGlCQUFDQTs7d0NBRWpCQSxnQkFBZ0JBO3dDQUNoQkEsbUJBQW1CQSxtQkFBY0E7O3dDQUVqQ0EsS0FBS0EsYUFBYUEsTUFBTUEsdUNBQXlCQTs0Q0FFaERBLGdCQUFnQkEscUJB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LGFBQWFBOzs7OzhCQUdzQkEsTUFBV0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt3Q0FFOUNBLHVCQUFpREE7O3dDQUVqREEsd0JBQW1EQSxVQUFDQTs0Q0FBb0JBLCtCQUErQkE7Ozt3Q0FFdkdBLDZCQUF3QkE7O3dDQUd4QkE7Ozt3Q0FFQ0EsdUJBQXVCQSxJQUFJQTt3Q0FDM0JBLFNBQWdDQTs7Ozs7OztvRUFBTkE7d0NBQzFCQSxlQUFlQSw0QkFBa0RBLDhCQUFhQSxBQUE4QkE7O3VEQUFRQSxxQkFBb0JBOzs7Ozs7OzZDQUNoSUEsZ0JBQWdCQTs7Ozs7Ozs7O3dDQUV6QkEsZ0NBQXdCQTs7d0NBRXhCQSxlQUFPQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBCcmlkZ2UuSHRtbDU7XG51c2luZyBTeXN0ZW07XG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xuXG5uYW1lc3BhY2UgQ29ubmVjdEZvdXJcbntcblx0ZGVsZWdhdGUgdm9pZCBDb2x1bW5TZWxlY3RlZEV2ZW50SGFuZGxlcihpbnQgY29sdW1uSW5kZXgpO1xuXG5cdGRlbGVnYXRlIHZvaWQgQ29sb3JDaGFuZ2VkRXZlbnRIYW5kbGVyKHN0cmluZyBjb2xvcik7XG5cblx0Y2xhc3MgQm9hcmRcblx0e1xuXHRcdHByaXZhdGUgY29uc3Qgc3RyaW5nIENPTE9SX1BMQVlFUl8xID0gXCIjQkFDOEQzXCI7XG5cdFx0cHJpdmF0ZSBjb25zdCBzdHJpbmcgQ09MT1JfUExBWUVSXzIgPSBcIiNGMEEzMEFcIjtcblx0XHRwcml2YXRlIGNvbnN0IHN0cmluZyBDT0xPUl9SQVNURVIgPSBcIiNGRkU3NERcIjtcblx0XHRwcml2YXRlIGNvbnN0IHN0cmluZyBDT0xPUl9DSElQX0JBQ0tHUk9VTkQgPSBcIndoaXRlXCI7XG5cblx0XHRwcml2YXRlIHJlYWRvbmx5IEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcztcblx0XHRwcml2YXRlIHJlYWRvbmx5IEhUTUxJbWFnZUVsZW1lbnQgaW1hZ2VDb250cm9sbGVyMTtcblx0XHRwcml2YXRlIHJlYWRvbmx5IEhUTUxJbWFnZUVsZW1lbnQgaW1hZ2VDb250cm9sbGVyMjtcblx0XHRwcml2YXRlIHJlYWRvbmx5IFRhc2tDb21wbGV0aW9uU291cmNlPGludD4gbG9hZGVkSW1hZ2VDb250cm9sbGVyMSA9IG5ldyBUYXNrQ29tcGxldGlvblNvdXJjZTxpbnQ+KCk7XG5cdFx0cHJpdmF0ZSByZWFkb25seSBUYXNrQ29tcGxldGlvblNvdXJjZTxpbnQ+IGxvYWRlZEltYWdlQ29udHJvbGxlcjIgPSBuZXcgVGFza0NvbXBsZXRpb25Tb3VyY2U8aW50PigpO1xuXG5cdFx0cHVibGljIGV2ZW50IENvbHVtblNlbGVjdGVkRXZlbnRIYW5kbGVyIENvbHVtblNlbGVjdGVkO1xuXG5cdFx0cHVibGljIE5vZGUgUm9vdCB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cblxuXHRcdHB1YmxpYyBCb2FyZCgpXG5cdFx0e1xuXHRcdFx0Y2FudmFzID0gbmV3IEhUTUxDYW52YXNFbGVtZW50KCk7XG5cblx0XHRcdGNhbnZhcy5TdHlsZS5Qb3NpdGlvbiA9IFBvc2l0aW9uLkFic29sdXRlO1xuXHRcdFx0Y2FudmFzLlN0eWxlLlRvcCA9IFwiNTAlXCI7XG5cdFx0XHRjYW52YXMuU3R5bGUuTGVmdCA9IFwiNTAlXCI7XG5cdFx0XHRjYW52YXMuU3R5bGUuVHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUoLTUwJSwgLTUwJSlcIjtcblx0XHRcdGNhbnZhcy5PbkNsaWNrID0gKGUpID0+XG5cdFx0XHR7XG5cdFx0XHRcdHZhciB4ID0gZS5QYWdlWCAtIGNhbnZhcy5PZmZzZXRMZWZ0ICsgMC41ICogY2FudmFzLldpZHRoO1xuXHRcdFx0XHR2YXIgeSA9IGUuUGFnZVkgLSBjYW52YXMuT2Zmc2V0VG9wICsgMC41ICogY2FudmFzLkhlaWdodDtcblxuXHRcdFx0XHRDb25zb2xlLldyaXRlTGluZShzdHJpbmcuRm9ybWF0KFwiWDogezB9LCBZOiB7MX1cIix4LHkpKTtcblx0XHRcdFx0aWYgKHkgPiAxMCAmJiB5IDwgNjApXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRmb3IgKGludCBjb2wgPSAwOyBjb2wgPCBHYW1lLkNPTFVNTlM7IGNvbCsrKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGlmICh4ID4gMTAgKyBjb2wgKiA2MCAmJiB4IDwgNjAgKyBjb2wgKiA2MClcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Q29sdW1uU2VsZWN0ZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PkNvbHVtblNlbGVjdGVkLkludm9rZShjb2wpKTpudWxsO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRSb290ID0gY2FudmFzO1xuXG5cdFx0XHRpbWFnZUNvbnRyb2xsZXIxID0gbmV3IEhUTUxJbWFnZUVsZW1lbnQoKTtcblx0XHRcdGltYWdlQ29udHJvbGxlcjEuT25Mb2FkID0gKF8pID0+IGxvYWRlZEltYWdlQ29udHJvbGxlcjEuU2V0UmVzdWx0KDApO1xuXHRcdFx0aW1hZ2VDb250cm9sbGVyMS5TcmMgPSBcImNoaXAxLnN2Z1wiO1xuXG5cdFx0XHRpbWFnZUNvbnRyb2xsZXIyID0gbmV3IEhUTUxJbWFnZUVsZW1lbnQoKTtcblx0XHRcdGltYWdlQ29udHJvbGxlcjIuT25Mb2FkID0gKF8pID0+IGxvYWRlZEltYWdlQ29udHJvbGxlcjIuU2V0UmVzdWx0KDApO1xuXHRcdFx0aW1hZ2VDb250cm9sbGVyMi5TcmMgPSBcImNoaXAyLnN2Z1wiO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBhc3luYyBUYXNrIFBhaW50KEdhbWUgZ2FtZSlcblx0XHR7XG5cdFx0XHRhd2FpdCBsb2FkZWRJbWFnZUNvbnRyb2xsZXIxLlRhc2s7XG5cdFx0XHRhd2FpdCBsb2FkZWRJbWFnZUNvbnRyb2xsZXIyLlRhc2s7XG5cblx0XHRcdHZhciBjdHggPSAoQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKWNhbnZhcy5HZXRDb250ZXh0KFwiMmRcIik7XG5cblx0XHRcdGNhbnZhcy5XaWR0aCA9IGdhbWUuQ2hpcHMuR2V0TGVuZ3RoKDEpICogNjAgKyAxMDtcblx0XHRcdGNhbnZhcy5IZWlnaHQgPSAoZ2FtZS5DaGlwcy5HZXRMZW5ndGgoMCkgKyAxKSAqIDYwICsgMTA7XG5cblx0XHRcdGN0eC5GaWxsU3R5bGUgPSBDT0xPUl9SQVNURVI7XG5cdFx0XHRjdHguRmlsbFJlY3QoMCwgMCwgY2FudmFzLldpZHRoLCBjYW52YXMuSGVpZ2h0KTtcblxuXHRcdFx0Zm9yIChpbnQgY29sID0gMDsgY29sIDwgZ2FtZS5DaGlwcy5HZXRMZW5ndGgoMSk7IGNvbCsrKVxuXHRcdFx0e1xuXHRcdFx0XHRjdHguRmlsbFN0eWxlID0gZ2FtZS5DdXJyZW50Q2hpcCA9PSBHYW1lLkNoaXAuTW91c2UgPyBDT0xPUl9QTEFZRVJfMSA6IENPTE9SX1BMQVlFUl8yO1xuXHRcdFx0XHRjdHguRmlsbFJlY3QoMTAgKyBjb2wgKiA2MCwgMTAsIDUwLCA1MCk7XG5cdFx0XHR9XG5cblx0XHRcdGZvciAoaW50IHJvdyA9IDA7IHJvdyA8IGdhbWUuQ2hpcHMuR2V0TGVuZ3RoKDApOyByb3crKylcblx0XHRcdHtcblx0XHRcdFx0Zm9yIChpbnQgY29sID0gMDsgY29sIDwgZ2FtZS5DaGlwcy5HZXRMZW5ndGgoMSk7IGNvbCsrKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWYgKGdhbWUuQ2hpcHNbcm93LCBjb2xdID09IEdhbWUuQ2hpcC5Nb3VzZSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjdHguRHJhd0ltYWdlKGltYWdlQ29udHJvbGxlcjEsIDEwICsgY29sICogNjAsIDEwICsgKHJvdyArIDEpICogNjAsIDUwZCwgNTBkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAoZ2FtZS5DaGlwc1tyb3csIGNvbF0gPT0gR2FtZS5DaGlwLkNhdClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjdHguRHJhd0ltYWdlKGltYWdlQ29udHJvbGxlcjIsIDEwICsgY29sICogNjAsIDEwICsgKHJvdyArIDEpICogNjAsIDUwZCwgNTBkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGN0eC5CZWdpblBhdGgoKTtcblx0XHRcdFx0XHRcdGN0eC5GaWxsU3R5bGUgPSBDT0xPUl9DSElQX0JBQ0tHUk9VTkQ7XG5cdFx0XHRcdFx0XHRjdHguRWxsaXBzZSgxMCArIDI1ICsgY29sICogNjAsIDEwICsgMjUgKyAocm93ICsgMSkgKiA2MCwgMjUsIDI1LCAwLCAwLCAyICogTWF0aC5QSSk7XG5cdFx0XHRcdFx0XHRjdHguRmlsbCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuIiwidXNpbmcgQnJpZGdlLkh0bWw1O1xudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xuXG5uYW1lc3BhY2UgQ29ubmVjdEZvdXJcbntcblx0ZGVsZWdhdGUgdm9pZCBHYW1lVXBkYXRlZEV2ZW50SGFuZGxlcihHYW1lIGdhbWUpO1xuXG5cdGNsYXNzIEdhbWVcblx0e1xuXHRcdHB1YmxpYyBjb25zdCBpbnQgUk9XUyA9IDY7XG5cdFx0cHVibGljIGNvbnN0IGludCBDT0xVTU5TID0gNztcblx0XHRwcml2YXRlIGNvbnN0IGludCBXSU4gPSA0O1xuXG5cdFx0cHVibGljIGV2ZW50IEdhbWVVcGRhdGVkRXZlbnRIYW5kbGVyIEdhbWVVcGRhdGVkO1xuXG5cdFx0cHVibGljIGVudW0gQ2hpcFxuXHRcdHtcblx0XHRcdE1vdXNlLFxuXHRcdFx0Q2F0XG5cdFx0fVxuXG5cdFx0cHVibGljIENoaXAgQ3VycmVudENoaXAgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcblxuXG5cdFx0cHVibGljIENoaXA/WyxdIENoaXBzIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG5cblxuXHRcdHB1YmxpYyBJQ29udHJvbGxlciBDb250cm9sbGVyMSB7IGdldDsgc2V0OyB9XG5cblx0XHRwdWJsaWMgSUNvbnRyb2xsZXIgQ29udHJvbGxlcjIgeyBnZXQ7IHNldDsgfVxuXG5cdFx0cHVibGljIGFzeW5jIFRhc2sgUnVuKClcblx0XHR7XG5cdFx0XHR3aGlsZSAodHJ1ZSlcblx0XHRcdHtcblx0XHRcdFx0R2FtZVVwZGF0ZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PkdhbWVVcGRhdGVkLkludm9rZSh0aGlzKSk6bnVsbDtcblxuXHRcdFx0XHRMaXN0PE1vdmU+IG1vdmVzID0gbmV3IExpc3Q8TW92ZT4oKTtcblx0XHRcdFx0Zm9yIChpbnQgaSA9IDA7IGkgPCBDT0xVTU5TOyBpKyspXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZiAoIUNoaXBzWzAsIGldLkhhc1ZhbHVlKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdG1vdmVzLkFkZChuZXcgTW92ZShpKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0TW92ZSBzZWxlY3RlZE1vdmUgPSAoQ3VycmVudENoaXAgPT0gQ2hpcC5Nb3VzZSA/IGF3YWl0IENvbnRyb2xsZXIxLlNlbGVjdCh0aGlzLCBtb3ZlcykgOiBhd2FpdCBDb250cm9sbGVyMi5TZWxlY3QodGhpcywgbW92ZXMpKTtcblxuXHRcdFx0XHRpZiAoTW92ZUFuZENoZWNrRm9yV2luKHNlbGVjdGVkTW92ZSkpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRHYW1lVXBkYXRlZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+R2FtZVVwZGF0ZWQuSW52b2tlKHRoaXMpKTpudWxsO1xuXHRcdFx0XHRcdFdpbmRvdy5TZXRUaW1lb3V0KChTeXN0ZW0uQWN0aW9uKSgoKSA9PlxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFdpbmRvdy5BbGVydChzdHJpbmcuRm9ybWF0KFwiezB9IHdpbnMhXCIsQ3VycmVudENoaXApKTtcblx0XHRcdFx0XHR9KSk7XG5cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdEN1cnJlbnRDaGlwID0gKEN1cnJlbnRDaGlwID09IENoaXAuTW91c2UgPyBDaGlwLkNhdCA6IENoaXAuTW91c2UpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHByaXZhdGUgYm9vbCBNb3ZlQW5kQ2hlY2tGb3JXaW4oTW92ZSBtKVxuXHRcdHtcblx0XHRcdGludCBpO1xuXHRcdFx0Zm9yIChpID0gMDsgaSA8IFJPV1M7IGkrKylcblx0XHRcdFx0aWYgKENoaXBzW2ksIG0uQ29sdW1uSW5kZXhdLkhhc1ZhbHVlKVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0Q2hpcHNbaSAtIDEsIG0uQ29sdW1uSW5kZXhdID0gQ3VycmVudENoaXA7XG5cdFx0XHRpbnQgcm93ID0gaSAtIDE7XG5cdFx0XHRpbnQgY29sID0gbS5Db2x1bW5JbmRleDtcblxuXHRcdFx0cmV0dXJuIENoZWNrQXhpcyhyb3csIGNvbCwgMCwgMSlcblx0XHRcdFx0fHwgQ2hlY2tBeGlzKHJvdywgY29sLCAxLCAwKVxuXHRcdFx0XHR8fCBDaGVja0F4aXMocm93LCBjb2wsIDEsIDEpXG5cdFx0XHRcdHx8IENoZWNrQXhpcyhyb3csIGNvbCwgMSwgLTEpO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgYm9vbCBDaGVja0F4aXMoaW50IHJvdywgaW50IGNvbCwgaW50IGRyb3csIGludCBkY29sKVxuXHRcdHtcblN5c3RlbS5GdW5jPGludCwgaW50LCBpbnQ+IENoZWNrT25lU2lkZSA9IG51bGw7XG5DaGVja09uZVNpZGUgPSAoZHJvdzIsIGRjb2wyKSA9PlxyXG57XHJcbiAgICBpbnQgYyA9IDA7XHJcbiAgICBmb3IgKGludCBpID0gMTsgaSA8IFdJTjsgaSsrKVxyXG4gICAgICAgIGlmIChjb2wgKyBpICogZGNvbDIgPj0gMCAmJiBjb2wgKyBpICogZGNvbDIgPCBDT0xVTU5TICYmIHJvdyArIGkgKiBkcm93MiA+PSAwICYmIHJvdyArIGkgKiBkcm93MiA8IFJPV1MgJiYgQ2hpcHNbcm93ICsgaSAqIGRyb3cyLCBjb2wgKyBpICogZGNvbDJdID09IEN1cnJlbnRDaGlwKVxyXG4gICAgICAgICAgICBjKys7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIHJldHVybiBjO1xyXG59XHJcblxyXG47XG5cdFx0XHRyZXR1cm4gQ2hlY2tPbmVTaWRlKGRyb3csIGRjb2wpICsgQ2hlY2tPbmVTaWRlKC1kcm93LCAtZGNvbCkgKyAxID49IFdJTjtcblxuXHRcdFx0XG5cdFx0fVxuXG5cdFx0cHVibGljIGNsYXNzIE1vdmVcblx0XHR7XG5cdFx0XHRwdWJsaWMgaW50IENvbHVtbkluZGV4IHsgZ2V0OyBwcml2YXRlIHNldDsgfVxuXG5cdFx0XHRwdWJsaWMgTW92ZShpbnQgY29sdW1uSW5kZXgpXG5cdFx0XHR7XG5cdFx0XHRcdENvbHVtbkluZGV4ID0gY29sdW1uSW5kZXg7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFxucHJpdmF0ZSBDaGlwIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19DdXJyZW50Q2hpcD1DaGlwLk1vdXNlO3ByaXZhdGUgQ2hpcD9bLF0gX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0NoaXBzPW5ldyBDaGlwP1tST1dTLCBDT0xVTU5TXTt9XG59XG4iLCJ1c2luZyBCcmlkZ2UuSHRtbDU7XG51c2luZyBTeXN0ZW07XG5cbm5hbWVzcGFjZSBDb25uZWN0Rm91clxue1xuXHRwdWJsaWMgY2xhc3MgUHJvZ3JhbVxuXHR7XG5cdFx0cHVibGljIHN0YXRpYyB2b2lkIE1haW4oKVxuXHRcdHtcblx0XHRcdENvbnNvbGUuV3JpdGVMaW5lKHN0cmluZy5Gb3JtYXQoXCJWZXJzaW9uOiB7MH1cIixWZXJzaW9uLkluZm8pKTtcblxuXHRcdFx0Qm9hcmQgYm9hcmQgPSBuZXcgQm9hcmQoKTtcblx0XHRcdERvY3VtZW50LkJvZHkuQXBwZW5kQ2hpbGQoYm9hcmQuUm9vdCk7XG5cdFx0XHREb2N1bWVudC5Cb2R5LlN0eWxlLkJhY2tncm91bmRJbWFnZSA9IFwidXJsKCdiYWNrZ3JvdW5kLnBuZycpXCI7XG5cblx0XHRcdEdhbWUgZ2FtZSA9IG5ldyBHYW1lXG5cdFx0XHR7XG5cdFx0XHRcdENvbnRyb2xsZXIxID0gbmV3IEh1bWFuQ29udHJvbGxlcihib2FyZCksXG5cdFx0XHRcdENvbnRyb2xsZXIyID0gbmV3IEh1bWFuQ29udHJvbGxlcihib2FyZClcblx0XHRcdH07XG5cblx0XHRcdGdhbWUuR2FtZVVwZGF0ZWQgKz0gYXN5bmMgKGcpID0+IGF3YWl0IGJvYXJkLlBhaW50KGcpO1xuQnJpZGdlLlNjcmlwdC5EaXNjYXJkPSBnYW1lLlJ1bigpO1xuXHRcdH1cblx0fVxufVxuIiwidXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XG51c2luZyBTeXN0ZW0uTGlucTtcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XG5cbm5hbWVzcGFjZSBDb25uZWN0Rm91clxue1xuXHRjbGFzcyBIdW1hbkNvbnRyb2xsZXIgOiBJQ29udHJvbGxlclxuXHR7XG5cdFx0cHJpdmF0ZSByZWFkb25seSBCb2FyZCBib2FyZDtcblxuXHRcdHB1YmxpYyBIdW1hbkNvbnRyb2xsZXIoQm9hcmQgYm9hcmQpXG5cdFx0e1xuXHRcdFx0dGhpcy5ib2FyZCA9IGJvYXJkO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBhc3luYyBUYXNrPEdhbWUuTW92ZT4gU2VsZWN0KEdhbWUgZ2FtZSwgSUVudW1lcmFibGU8R2FtZS5Nb3ZlPiBhbGxvd2VkTW92ZXMpXG5cdFx0e1xuXHRcdFx0VGFza0NvbXBsZXRpb25Tb3VyY2U8aW50PiB0YXNrQ29tcGxldGlvblNvdXJjZSA9IG51bGw7XG5cblx0XHRcdENvbHVtblNlbGVjdGVkRXZlbnRIYW5kbGVyIGNvbHVtblNlbGVjdGVkSGFuZGxlciA9IChpbnQgY29sdW1uSW5kZXgpID0+IHRhc2tDb21wbGV0aW9uU291cmNlLlNldFJlc3VsdChjb2x1bW5JbmRleCk7XG5cblx0XHRcdGJvYXJkLkNvbHVtblNlbGVjdGVkICs9IGNvbHVtblNlbGVjdGVkSGFuZGxlcjtcblxuXHRcdFx0R2FtZS5Nb3ZlIHNlbGVjdGVkTW92ZTtcblx0XHRcdGRvXG5cdFx0XHR7XG5cdFx0XHRcdHRhc2tDb21wbGV0aW9uU291cmNlID0gbmV3IFRhc2tDb21wbGV0aW9uU291cmNlPGludD4oKTtcblx0XHRcdFx0aW50IHNlbGVjdGVkQ29sdW1uSW5kZXggPSBhd2FpdCB0YXNrQ29tcGxldGlvblNvdXJjZS5UYXNrO1xuXHRcdFx0XHRzZWxlY3RlZE1vdmUgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNpbmdsZU9yRGVmYXVsdDxHYW1lLk1vdmU+KGFsbG93ZWRNb3ZlcywoU3lzdGVtLkZ1bmM8R2FtZS5Nb3ZlLGJvb2w+KShtb3ZlID0+IG1vdmUuQ29sdW1uSW5kZXggPT0gc2VsZWN0ZWRDb2x1bW5JbmRleCkpO1xuXHRcdFx0fSB3aGlsZSAoc2VsZWN0ZWRNb3ZlID09IG51bGwpO1xuXG5cdFx0XHRib2FyZC5Db2x1bW5TZWxlY3RlZCAtPSBjb2x1bW5TZWxlY3RlZEhhbmRsZXI7XG5cblx0XHRcdHJldHVybiBzZWxlY3RlZE1vdmU7XG5cdFx0fVxuXHR9XG59XG4iXQp9Cg==
