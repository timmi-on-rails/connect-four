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
                COLOR_PLAYER_2: null
            },
            ctors: {
                init: function () {
                    this.COLOR_PLAYER_1 = "blue";
                    this.COLOR_PLAYER_2 = "red";
                }
            }
        },
        fields: {
            canvas: null,
            Root: null
        },
        events: {
            ColorChanged: null,
            ColumnSelected: null
        },
        ctors: {
            ctor: function () {
                this.$initialize();
                this.canvas = document.createElement("canvas");

                var divElement = document.createElement("div");

                var createButton = Bridge.fn.bind(this, function (columnIndex) {
                    var $t;
                    var button = ($t = document.createElement("button"), $t.onclick = Bridge.fn.bind(this, function (e) {
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
            }
        },
        methods: {
            Paint: function (game) {
                !Bridge.staticEquals(this.ColorChanged, null) ? this.ColorChanged(game.CurrentChip === ConnectFour.Game.Chip.Player1 ? ConnectFour.Board.COLOR_PLAYER_1 : ConnectFour.Board.COLOR_PLAYER_2) : null;

                var ctx = this.canvas.getContext("2d");

                this.canvas.width = 550;
                this.canvas.height = 500;

                for (var row = 0; row < System.Array.getLength(game.Chips, 0); row = (row + 1) | 0) {
                    for (var col = 0; col < System.Array.getLength(game.Chips, 1); col = (col + 1) | 0) {
                        var color = "#f0f0f0";

                        if (System.Nullable.eq(game.Chips.get([row, col]), ConnectFour.Game.Chip.Player1)) {
                            color = ConnectFour.Board.COLOR_PLAYER_1;
                        }

                        if (System.Nullable.eq(game.Chips.get([row, col]), ConnectFour.Game.Chip.Player2)) {
                            color = ConnectFour.Board.COLOR_PLAYER_2;
                        }

                        ctx.fillStyle = color;
                        ctx.fillRect(Bridge.Int.mul(col, 60), Bridge.Int.mul(row, 60), 50, 50);
                    }
                }
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
                this.CurrentChip = ConnectFour.Game.Chip.Player1;
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

                                        if (this.CurrentChip === ConnectFour.Game.Chip.Player1) {
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
                                            window.alert(System.String.format("{0} wins!", [Bridge.box(this.CurrentChip, ConnectFour.Game.Chip, System.Enum.toStringFn(ConnectFour.Game.Chip))]));
                                            !Bridge.staticEquals(this.GameUpdated, null) ? this.GameUpdated(this) : null;
                                            $step = 8;
                                            continue;
                                        }

                                        this.CurrentChip = (this.CurrentChip === ConnectFour.Game.Chip.Player1 ? ConnectFour.Game.Chip.Player2 : ConnectFour.Game.Chip.Player1);

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

                if (this.Row(row, col, 0, 1) || this.Row(row, col, 1, 0) || this.Row(row, col, 1, 1) || this.Row(row, col, 1, -1)) {
                    return true;
                }

                return false;
            },
            Row: function (row, col, drow, dcol) {
                var C = null;
                C = Bridge.fn.bind(this, function (drow2, dcol2) {
                    var c = 0;
                    for (var i = 1; i < ConnectFour.Game.WIN; i = (i + 1) | 0) {
                        if (((col + Bridge.Int.mul(i, dcol2)) | 0) >= 0 && ((col + Bridge.Int.mul(i, dcol2)) | 0) < ConnectFour.Game.COLUMNS && ((row + Bridge.Int.mul(i, drow2)) | 0) >= 0 && ((row + Bridge.Int.mul(i, drow2)) | 0) < ConnectFour.Game.ROWS && System.Nullable.eq(this.Chips.get([((row + Bridge.Int.mul(i, drow2)) | 0), ((col + Bridge.Int.mul(i, dcol2)) | 0)]), this.CurrentChip)) {
                            if (System.Nullable.eq(this.CurrentChip, this.Chips.get([((row + Bridge.Int.mul(i, drow2)) | 0), ((col + Bridge.Int.mul(i, dcol2)) | 0)]))) {
                                c = (c + 1) | 0;
                            } else {
                                break;
                            }
                        }
                    }
                    return c;
                });
                return ((((C(drow, dcol) + C(((-drow) | 0), ((-dcol) | 0))) | 0) + 1) | 0) >= ConnectFour.Game.WIN;


            }
        }
    });

    Bridge.define("ConnectFour.Game.Chip", {
        $kind: "nested enum",
        statics: {
            fields: {
                Player1: 0,
                Player2: 1
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

            game.addGameUpdated(Bridge.fn.cacheBind(board, board.Paint));
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
                    this.Info = "1.0.8";
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDb25uZWN0Rm91ci5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiQm9hcmQuY3MiLCJHYW1lLmNzIiwiUHJvZ3JhbS5jcyIsIkh1bWFuQ29udHJvbGxlci5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0JBd0JHQSxjQUFTQTs7Z0JBRVRBLGlCQUFpQkE7O2dCQUVqQkEsbUJBQTRDQSwrQkFBQ0E7O29CQUU1Q0EsYUFBYUEscURBRUZBLCtCQUFDQTt3QkFBUUEsMENBQWdCQSxRQUFLQSxBQUFxQ0Esb0JBQXNCQSxlQUFjQTs7b0JBRWxIQTtvQkFDQUE7b0JBQ0FBO29CQUNBQTtvQkFDQUEscUJBQWdCQSxVQUFDQTt3QkFBTUEsMEJBQTBCQTs7O29CQUVqREEsT0FBT0E7OztnQkFHUkEsdUJBQXVCQTtnQkFDdkJBLHVCQUF1QkE7Z0JBQ3ZCQSx1QkFBdUJBO2dCQUN2QkEsdUJBQXVCQTtnQkFDdkJBLHVCQUF1QkE7Z0JBQ3ZCQSx1QkFBdUJBO2dCQUN2QkEsdUJBQXVCQTs7Z0JBRXZCQSxZQUFPQTtnQkFDUEEsc0JBQWlCQTtnQkFDakJBLHNCQUFpQkE7Ozs7NkJBR0FBO2dCQUVqQkEsd0NBQWNBLFFBQUtBLEFBQXFDQSxrQkFBb0JBLHFCQUFvQkEsZ0NBQW9CQSxtQ0FBaUJBLG9DQUFpQkE7O2dCQUV0SkEsVUFBVUEsQUFBMEJBOztnQkFFcENBO2dCQUNBQTs7Z0JBRUFBLEtBQUtBLGFBQWFBLE1BQU1BLHVDQUF5QkE7b0JBRWhEQSxLQUFLQSxhQUFhQSxNQUFNQSx1Q0FBeUJBO3dCQUVoREE7O3dCQUVBQSxJQUFJQSxtQ0FBV0EsS0FBS0EsT0FBUUE7NEJBRTNCQSxRQUFRQTs7O3dCQUdUQSxJQUFJQSxtQ0FBV0EsS0FBS0EsT0FBUUE7NEJBRTNCQSxRQUFRQTs7O3dCQUdUQSxnQkFBZ0JBO3dCQUNoQkEsYUFBYUEseUJBQVVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7bUNDMEJzQkE7NkJBQTZEQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3dDQXhFM0dBLHVDQUFhQSxRQUFLQSxBQUFxQ0EsaUJBQW1CQSxRQUFPQTs7d0NBRWpGQSxRQUFtQkEsS0FBSUE7d0NBQ3ZCQSxLQUFLQSxXQUFXQSxJQUFJQSwwQkFBU0E7NENBRTVCQSxJQUFJQSxDQUFDQSw0Q0FBU0E7Z0RBRWJBLFVBQVVBLElBQUlBLHNCQUFLQTs7Ozt3Q0FJckJBLElBQXFCQSxxQkFBZUE7Ozs7Ozs7OztpREFBcUJBLGdEQUFtQkEsTUFBTUE7Ozs7Ozs7dURBQS9CQTs7Ozs7aURBQThDQSxnREFBbUJBLE1BQU1BOzs7Ozs7O3VEQUEvQkE7Ozs7O3VEQUF2RUEsQ0FBQ0E7O3dDQUVyQkEsSUFBSUEsd0JBQW1CQTs0Q0FFdEJBLGFBQWFBLG1DQUEwQkE7NENBQ3ZDQSx1Q0FBYUEsUUFBS0EsQUFBcUNBLGlCQUFtQkEsUUFBT0E7NENBQ2pGQTs7Ozt3Q0FHREEsbUJBQWNBLENBQUNBLHFCQUFlQSxnQ0FBZUEsZ0NBQWVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MENBSTlCQTtnQkFFL0JBO2dCQUNBQSxLQUFLQSxPQUFPQSxJQUFJQSx1QkFBTUE7b0JBQ3JCQSxJQUFJQSx5Q0FBTUEsR0FBR0E7d0JBQ1pBOzs7Z0JBQ0ZBLGdCQUFNQSxlQUFPQSxnQkFBaUJBO2dCQUM5QkEsVUFBVUE7Z0JBQ1ZBLFVBQVVBOztnQkFFVkEsSUFBSUEsU0FBSUEsS0FBS0EsY0FBY0EsU0FBSUEsS0FBS0EsY0FBY0EsU0FBSUEsS0FBS0EsY0FBY0EsU0FBSUEsS0FBS0EsUUFBUUE7b0JBQ3pGQTs7O2dCQUVEQTs7MkJBR2dCQSxLQUFTQSxLQUFTQSxNQUFVQTtnQkFFL0NBLFFBQStCQTtnQkFDL0JBLElBQUlBLCtCQUFDQSxPQUFPQTtvQkFFUkE7b0JBQ0FBLEtBQUtBLFdBQVdBLElBQUlBLHNCQUFLQTt3QkFDckJBLElBQUlBLFFBQU1BLGtCQUFJQSxxQkFBY0EsUUFBTUEsa0JBQUlBLGVBQVFBLDRCQUFXQSxRQUFNQSxrQkFBSUEscUJBQWNBLFFBQU1BLGtCQUFJQSxlQUFRQSx5QkFBUUEsbUNBQU1BLFFBQU1BLGtCQUFJQSxjQUFPQSxRQUFNQSxrQkFBSUEsZ0JBQVVBOzRCQUNsSkEsSUFBSUEscUNBQWVBLGdCQUFNQSxRQUFNQSxrQkFBSUEsY0FBT0EsUUFBTUEsa0JBQUlBO2dDQUNoREE7O2dDQUVBQTs7OztvQkFDWkEsT0FBT0E7O2dCQUlSQSxPQUFPQSxNQUFFQSxNQUFNQSxRQUFRQSxFQUFFQSxHQUFDQSxZQUFNQSxHQUFDQSwrQkFBYUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRCQVNsQ0E7O2dCQUVYQSxtQkFBY0E7Ozs7Ozs7Ozs7OztZQzlGZkEseUJBQWtCQSxzQ0FBNkJBOztZQUUvQ0EsWUFBY0EsSUFBSUE7WUFDbEJBLDBCQUEwQkE7O1lBRTFCQSxXQUFZQSxVQUFJQSxxQ0FFREEsSUFBSUEsNEJBQWdCQSx5QkFDcEJBLElBQUlBLDRCQUFnQkE7O1lBR25DQSxvQkFBb0JBO1lBQ3ZCQSxxQkFBdUJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7NEJDWEVBOztnQkFFdEJBLGFBQWFBOzs7OzhCQUdzQkEsTUFBV0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt3Q0FFOUNBLHVCQUFpREE7O3dDQUVqREEsd0JBQW1EQSxVQUFDQTs0Q0FBb0JBLCtCQUErQkE7Ozt3Q0FFdkdBLDZCQUF3QkE7O3dDQUd4QkE7Ozt3Q0FFQ0EsdUJBQXVCQSxJQUFJQTt3Q0FDM0JBLFNBQWdDQTs7Ozs7OztvRUFBTkE7d0NBQzFCQSxlQUFlQSw0QkFBa0RBLDhCQUFhQSxBQUE4QkE7O3VEQUFRQSxxQkFBb0JBOzs7Ozs7OzZDQUNoSUEsZ0JBQWdCQTs7Ozs7Ozs7O3dDQUV6QkEsZ0NBQXdCQTs7d0NBRXhCQSxlQUFPQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBCcmlkZ2UuSHRtbDU7XG51c2luZyBTeXN0ZW07XG5cbm5hbWVzcGFjZSBDb25uZWN0Rm91clxue1xuXHRkZWxlZ2F0ZSB2b2lkIENvbHVtblNlbGVjdGVkRXZlbnRIYW5kbGVyKGludCBjb2x1bW5JbmRleCk7XG5cblx0ZGVsZWdhdGUgdm9pZCBDb2xvckNoYW5nZWRFdmVudEhhbmRsZXIoc3RyaW5nIGNvbG9yKTtcblxuXHRjbGFzcyBCb2FyZFxuXHR7XG5cdFx0cHJpdmF0ZSBjb25zdCBzdHJpbmcgQ09MT1JfUExBWUVSXzEgPSBcImJsdWVcIjtcblx0XHRwcml2YXRlIGNvbnN0IHN0cmluZyBDT0xPUl9QTEFZRVJfMiA9IFwicmVkXCI7XG5cblx0XHRwcml2YXRlIHJlYWRvbmx5IEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcztcblxuXHRcdHByaXZhdGUgZXZlbnQgQ29sb3JDaGFuZ2VkRXZlbnRIYW5kbGVyIENvbG9yQ2hhbmdlZDtcblxuXHRcdHB1YmxpYyBldmVudCBDb2x1bW5TZWxlY3RlZEV2ZW50SGFuZGxlciBDb2x1bW5TZWxlY3RlZDtcblxuXHRcdHB1YmxpYyBOb2RlIFJvb3QgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XG5cblx0XHRwdWJsaWMgQm9hcmQoKVxuXHRcdHtcblx0XHRcdGNhbnZhcyA9IG5ldyBIVE1MQ2FudmFzRWxlbWVudCgpO1xuXG5cdFx0XHR2YXIgZGl2RWxlbWVudCA9IG5ldyBIVE1MRGl2RWxlbWVudCgpO1xuXG5cdFx0XHRGdW5jPGludCwgSFRNTEJ1dHRvbkVsZW1lbnQ+IGNyZWF0ZUJ1dHRvbiA9IChpbnQgY29sdW1uSW5kZXgpID0+XG5cdFx0XHR7XG5cdFx0XHRcdHZhciBidXR0b24gPSBuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcblx0XHRcdFx0e1xuXHRcdFx0XHRcdE9uQ2xpY2sgPSAoZSkgPT4geyBDb2x1bW5TZWxlY3RlZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+Q29sdW1uU2VsZWN0ZWQuSW52b2tlKGNvbHVtbkluZGV4KSk6bnVsbDsgfVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRidXR0b24uU3R5bGUuV2lkdGggPSBcIjUwcHhcIjtcblx0XHRcdFx0YnV0dG9uLlN0eWxlLkhlaWdodCA9IFwiNTBweFwiO1xuXHRcdFx0XHRidXR0b24uU3R5bGUuTWFyZ2luUmlnaHQgPSBcIjEwcHhcIjtcblx0XHRcdFx0YnV0dG9uLlN0eWxlLk1hcmdpbkJvdHRvbSA9IFwiMTBweFwiO1xuXHRcdFx0XHRDb2xvckNoYW5nZWQgKz0gKGMpID0+IGJ1dHRvbi5TdHlsZS5CYWNrZ3JvdW5kID0gYztcblxuXHRcdFx0XHRyZXR1cm4gYnV0dG9uO1xuXHRcdFx0fTtcblxuXHRcdFx0ZGl2RWxlbWVudC5BcHBlbmRDaGlsZChjcmVhdGVCdXR0b24oMCkpO1xuXHRcdFx0ZGl2RWxlbWVudC5BcHBlbmRDaGlsZChjcmVhdGVCdXR0b24oMSkpO1xuXHRcdFx0ZGl2RWxlbWVudC5BcHBlbmRDaGlsZChjcmVhdGVCdXR0b24oMikpO1xuXHRcdFx0ZGl2RWxlbWVudC5BcHBlbmRDaGlsZChjcmVhdGVCdXR0b24oMykpO1xuXHRcdFx0ZGl2RWxlbWVudC5BcHBlbmRDaGlsZChjcmVhdGVCdXR0b24oNCkpO1xuXHRcdFx0ZGl2RWxlbWVudC5BcHBlbmRDaGlsZChjcmVhdGVCdXR0b24oNSkpO1xuXHRcdFx0ZGl2RWxlbWVudC5BcHBlbmRDaGlsZChjcmVhdGVCdXR0b24oNikpO1xuXG5cdFx0XHRSb290ID0gbmV3IEhUTUxEaXZFbGVtZW50KCk7XG5cdFx0XHRSb290LkFwcGVuZENoaWxkKGRpdkVsZW1lbnQpO1xuXHRcdFx0Um9vdC5BcHBlbmRDaGlsZChjYW52YXMpO1xuXHRcdH1cblxuXHRcdHB1YmxpYyB2b2lkIFBhaW50KEdhbWUgZ2FtZSlcblx0XHR7XG5cdFx0XHRDb2xvckNoYW5nZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PkNvbG9yQ2hhbmdlZC5JbnZva2UoZ2FtZS5DdXJyZW50Q2hpcCA9PSBHYW1lLkNoaXAuUGxheWVyMSA/IENPTE9SX1BMQVlFUl8xIDogQ09MT1JfUExBWUVSXzIpKTpudWxsO1xuXG5cdFx0XHR2YXIgY3R4ID0gKENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCljYW52YXMuR2V0Q29udGV4dChcIjJkXCIpO1xuXG5cdFx0XHRjYW52YXMuV2lkdGggPSA1NTA7XG5cdFx0XHRjYW52YXMuSGVpZ2h0ID0gNTAwO1xuXG5cdFx0XHRmb3IgKGludCByb3cgPSAwOyByb3cgPCBnYW1lLkNoaXBzLkdldExlbmd0aCgwKTsgcm93KyspXG5cdFx0XHR7XG5cdFx0XHRcdGZvciAoaW50IGNvbCA9IDA7IGNvbCA8IGdhbWUuQ2hpcHMuR2V0TGVuZ3RoKDEpOyBjb2wrKylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHN0cmluZyBjb2xvciA9IFwiI2YwZjBmMFwiO1xuXG5cdFx0XHRcdFx0aWYgKGdhbWUuQ2hpcHNbcm93LCBjb2xdID09IEdhbWUuQ2hpcC5QbGF5ZXIxKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbG9yID0gQ09MT1JfUExBWUVSXzE7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGdhbWUuQ2hpcHNbcm93LCBjb2xdID09IEdhbWUuQ2hpcC5QbGF5ZXIyKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbG9yID0gQ09MT1JfUExBWUVSXzI7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Y3R4LkZpbGxTdHlsZSA9IGNvbG9yO1xuXHRcdFx0XHRcdGN0eC5GaWxsUmVjdChjb2wgKiA2MCwgcm93ICogNjAsIDUwLCA1MCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cbiIsInVzaW5nIEJyaWRnZS5IdG1sNTtcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcblxubmFtZXNwYWNlIENvbm5lY3RGb3VyXG57XG5cdGRlbGVnYXRlIHZvaWQgR2FtZVVwZGF0ZWRFdmVudEhhbmRsZXIoR2FtZSBnYW1lKTtcblxuXHRjbGFzcyBHYW1lXG5cdHtcblx0XHRwdWJsaWMgY29uc3QgaW50IFJPV1MgPSA2O1xuXHRcdHB1YmxpYyBjb25zdCBpbnQgQ09MVU1OUyA9IDc7XG5cdFx0cHJpdmF0ZSBjb25zdCBpbnQgV0lOID0gNDtcblxuXHRcdHB1YmxpYyBldmVudCBHYW1lVXBkYXRlZEV2ZW50SGFuZGxlciBHYW1lVXBkYXRlZDtcblxuXHRcdHB1YmxpYyBlbnVtIENoaXBcblx0XHR7XG5cdFx0XHRQbGF5ZXIxLFxuXHRcdFx0UGxheWVyMlxuXHRcdH1cblxuXHRcdHB1YmxpYyBDaGlwIEN1cnJlbnRDaGlwIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG5cblxuXHRcdHB1YmxpYyBDaGlwP1ssXSBDaGlwcyB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuXG5cblx0XHRwdWJsaWMgSUNvbnRyb2xsZXIgQ29udHJvbGxlcjEgeyBnZXQ7IHNldDsgfVxuXG5cdFx0cHVibGljIElDb250cm9sbGVyIENvbnRyb2xsZXIyIHsgZ2V0OyBzZXQ7IH1cblxuXHRcdHB1YmxpYyBhc3luYyBUYXNrIFJ1bigpXG5cdFx0e1xuXHRcdFx0d2hpbGUgKHRydWUpXG5cdFx0XHR7XG5cdFx0XHRcdEdhbWVVcGRhdGVkIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT5HYW1lVXBkYXRlZC5JbnZva2UodGhpcykpOm51bGw7XG5cblx0XHRcdFx0TGlzdDxNb3ZlPiBtb3ZlcyA9IG5ldyBMaXN0PE1vdmU+KCk7XG5cdFx0XHRcdGZvciAoaW50IGkgPSAwOyBpIDwgQ09MVU1OUzsgaSsrKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWYgKCFDaGlwc1swLCBpXS5IYXNWYWx1ZSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRtb3Zlcy5BZGQobmV3IE1vdmUoaSkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdE1vdmUgc2VsZWN0ZWRNb3ZlID0gKEN1cnJlbnRDaGlwID09IENoaXAuUGxheWVyMSA/IGF3YWl0IENvbnRyb2xsZXIxLlNlbGVjdCh0aGlzLCBtb3ZlcykgOiBhd2FpdCBDb250cm9sbGVyMi5TZWxlY3QodGhpcywgbW92ZXMpKTtcblxuXHRcdFx0XHRpZiAoTW92ZUFuZENoZWNrRm9yV2luKHNlbGVjdGVkTW92ZSkpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRXaW5kb3cuQWxlcnQoc3RyaW5nLkZvcm1hdChcInswfSB3aW5zIVwiLEN1cnJlbnRDaGlwKSk7XG5cdFx0XHRcdFx0R2FtZVVwZGF0ZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PkdhbWVVcGRhdGVkLkludm9rZSh0aGlzKSk6bnVsbDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdEN1cnJlbnRDaGlwID0gKEN1cnJlbnRDaGlwID09IENoaXAuUGxheWVyMSA/IENoaXAuUGxheWVyMiA6IENoaXAuUGxheWVyMSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBib29sIE1vdmVBbmRDaGVja0ZvcldpbihNb3ZlIG0pXG5cdFx0e1xuXHRcdFx0aW50IGk7XG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgUk9XUzsgaSsrKVxuXHRcdFx0XHRpZiAoQ2hpcHNbaSwgbS5Db2x1bW5JbmRleF0uSGFzVmFsdWUpXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRDaGlwc1tpIC0gMSwgbS5Db2x1bW5JbmRleF0gPSBDdXJyZW50Q2hpcDtcblx0XHRcdGludCByb3cgPSBpIC0gMTtcblx0XHRcdGludCBjb2wgPSBtLkNvbHVtbkluZGV4O1xuXG5cdFx0XHRpZiAoUm93KHJvdywgY29sLCAwLCAxKSB8fCBSb3cocm93LCBjb2wsIDEsIDApIHx8IFJvdyhyb3csIGNvbCwgMSwgMSkgfHwgUm93KHJvdywgY29sLCAxLCAtMSkpXG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBib29sIFJvdyhpbnQgcm93LCBpbnQgY29sLCBpbnQgZHJvdywgaW50IGRjb2wpXG5cdFx0e1xuU3lzdGVtLkZ1bmM8aW50LCBpbnQsIGludD4gQyA9IG51bGw7XG5DID0gKGRyb3cyLCBkY29sMikgPT5cclxue1xyXG4gICAgaW50IGMgPSAwO1xyXG4gICAgZm9yIChpbnQgaSA9IDE7IGkgPCBXSU47IGkrKylcclxuICAgICAgICBpZiAoY29sICsgaSAqIGRjb2wyID49IDAgJiYgY29sICsgaSAqIGRjb2wyIDwgQ09MVU1OUyAmJiByb3cgKyBpICogZHJvdzIgPj0gMCAmJiByb3cgKyBpICogZHJvdzIgPCBST1dTICYmIENoaXBzW3JvdyArIGkgKiBkcm93MiwgY29sICsgaSAqIGRjb2wyXSA9PSBDdXJyZW50Q2hpcClcclxuICAgICAgICAgICAgaWYgKEN1cnJlbnRDaGlwID09IENoaXBzW3JvdyArIGkgKiBkcm93MiwgY29sICsgaSAqIGRjb2wyXSlcclxuICAgICAgICAgICAgICAgIGMrKztcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICByZXR1cm4gYztcclxufVxyXG5cclxuO1xuXHRcdFx0cmV0dXJuIEMoZHJvdywgZGNvbCkgKyBDKC1kcm93LCAtZGNvbCkgKyAxID49IFdJTjtcblxuXHRcdFx0XG5cdFx0fVxuXG5cdFx0cHVibGljIGNsYXNzIE1vdmVcblx0XHR7XG5cdFx0XHRwdWJsaWMgaW50IENvbHVtbkluZGV4IHsgZ2V0OyBwcml2YXRlIHNldDsgfVxuXG5cdFx0XHRwdWJsaWMgTW92ZShpbnQgY29sdW1uSW5kZXgpXG5cdFx0XHR7XG5cdFx0XHRcdENvbHVtbkluZGV4ID0gY29sdW1uSW5kZXg7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFxucHJpdmF0ZSBDaGlwIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19DdXJyZW50Q2hpcD1DaGlwLlBsYXllcjE7cHJpdmF0ZSBDaGlwP1ssXSBfX1Byb3BlcnR5X19Jbml0aWFsaXplcl9fQ2hpcHM9bmV3IENoaXA/W1JPV1MsIENPTFVNTlNdO31cbn1cbiIsInVzaW5nIEJyaWRnZS5IdG1sNTtcbnVzaW5nIFN5c3RlbTtcblxubmFtZXNwYWNlIENvbm5lY3RGb3VyXG57XG5cdHB1YmxpYyBjbGFzcyBQcm9ncmFtXG5cdHtcblx0XHRwdWJsaWMgc3RhdGljIHZvaWQgTWFpbigpXG5cdFx0e1xuXHRcdFx0Q29uc29sZS5Xcml0ZUxpbmUoc3RyaW5nLkZvcm1hdChcIlZlcnNpb246IHswfVwiLFZlcnNpb24uSW5mbykpO1xuXG5cdFx0XHRCb2FyZCBib2FyZCA9IG5ldyBCb2FyZCgpO1xuXHRcdFx0RG9jdW1lbnQuQm9keS5BcHBlbmRDaGlsZChib2FyZC5Sb290KTtcblxuXHRcdFx0R2FtZSBnYW1lID0gbmV3IEdhbWVcblx0XHRcdHtcblx0XHRcdFx0Q29udHJvbGxlcjEgPSBuZXcgSHVtYW5Db250cm9sbGVyKGJvYXJkKSxcblx0XHRcdFx0Q29udHJvbGxlcjIgPSBuZXcgSHVtYW5Db250cm9sbGVyKGJvYXJkKVxuXHRcdFx0fTtcblxuXHRcdFx0Z2FtZS5HYW1lVXBkYXRlZCArPSBib2FyZC5QYWludDtcbkJyaWRnZS5TY3JpcHQuRGlzY2FyZD0gZ2FtZS5SdW4oKTtcblx0XHR9XG5cdH1cbn1cbiIsInVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xudXNpbmcgU3lzdGVtLkxpbnE7XG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xuXG5uYW1lc3BhY2UgQ29ubmVjdEZvdXJcbntcblx0Y2xhc3MgSHVtYW5Db250cm9sbGVyIDogSUNvbnRyb2xsZXJcblx0e1xuXHRcdHByaXZhdGUgcmVhZG9ubHkgQm9hcmQgYm9hcmQ7XG5cblx0XHRwdWJsaWMgSHVtYW5Db250cm9sbGVyKEJvYXJkIGJvYXJkKVxuXHRcdHtcblx0XHRcdHRoaXMuYm9hcmQgPSBib2FyZDtcblx0XHR9XG5cblx0XHRwdWJsaWMgYXN5bmMgVGFzazxHYW1lLk1vdmU+IFNlbGVjdChHYW1lIGdhbWUsIElFbnVtZXJhYmxlPEdhbWUuTW92ZT4gYWxsb3dlZE1vdmVzKVxuXHRcdHtcblx0XHRcdFRhc2tDb21wbGV0aW9uU291cmNlPGludD4gdGFza0NvbXBsZXRpb25Tb3VyY2UgPSBudWxsO1xuXG5cdFx0XHRDb2x1bW5TZWxlY3RlZEV2ZW50SGFuZGxlciBjb2x1bW5TZWxlY3RlZEhhbmRsZXIgPSAoaW50IGNvbHVtbkluZGV4KSA9PiB0YXNrQ29tcGxldGlvblNvdXJjZS5TZXRSZXN1bHQoY29sdW1uSW5kZXgpO1xuXG5cdFx0XHRib2FyZC5Db2x1bW5TZWxlY3RlZCArPSBjb2x1bW5TZWxlY3RlZEhhbmRsZXI7XG5cblx0XHRcdEdhbWUuTW92ZSBzZWxlY3RlZE1vdmU7XG5cdFx0XHRkb1xuXHRcdFx0e1xuXHRcdFx0XHR0YXNrQ29tcGxldGlvblNvdXJjZSA9IG5ldyBUYXNrQ29tcGxldGlvblNvdXJjZTxpbnQ+KCk7XG5cdFx0XHRcdGludCBzZWxlY3RlZENvbHVtbkluZGV4ID0gYXdhaXQgdGFza0NvbXBsZXRpb25Tb3VyY2UuVGFzaztcblx0XHRcdFx0c2VsZWN0ZWRNb3ZlID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TaW5nbGVPckRlZmF1bHQ8R2FtZS5Nb3ZlPihhbGxvd2VkTW92ZXMsKFN5c3RlbS5GdW5jPEdhbWUuTW92ZSxib29sPikobW92ZSA9PiBtb3ZlLkNvbHVtbkluZGV4ID09IHNlbGVjdGVkQ29sdW1uSW5kZXgpKTtcblx0XHRcdH0gd2hpbGUgKHNlbGVjdGVkTW92ZSA9PSBudWxsKTtcblxuXHRcdFx0Ym9hcmQuQ29sdW1uU2VsZWN0ZWQgLT0gY29sdW1uU2VsZWN0ZWRIYW5kbGVyO1xuXG5cdFx0XHRyZXR1cm4gc2VsZWN0ZWRNb3ZlO1xuXHRcdH1cblx0fVxufVxuIl0KfQo=
