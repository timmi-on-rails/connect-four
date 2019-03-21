/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2019
 * @compiler Bridge.NET 17.7.0
 */
Bridge.assembly("ConnectFour", function ($asm, globals) {
    "use strict";

    Bridge.define("ConnectFour.Game", {
        statics: {
            fields: {
                rows: 0,
                cols: 0
            },
            ctors: {
                init: function () {
                    this.rows = 6;
                    this.cols = 7;
                }
            }
        },
        fields: {
            currentChip: 0,
            chips: null,
            Controller1: null,
            Controller2: null,
            win: 0
        },
        events: {
            OnUpdate: null
        },
        ctors: {
            init: function () {
                this.currentChip = ConnectFour.Game.Chip.C1;
                this.chips = System.Array.create(0, null, ConnectFour.Game.Chip, 6, 7);
                this.win = 4;
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
                    $t, 
                    m, 
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
                                        moves = new (System.Collections.Generic.List$1(ConnectFour.Move)).ctor();
                                        for (var i = 0; i < ConnectFour.Game.cols; i = (i + 1) | 0) {
                                            if (this.chips.get([0, i]) === ConnectFour.Game.Chip.NONE) {
                                                moves.add(($t = new ConnectFour.Move(), $t.Index = i, $t));
                                            }
                                        }

                                        if (this.currentChip === ConnectFour.Game.Chip.C1) {
                                            $step = 3;
                                            continue;
                                        }  else {
                                            $step = 5;
                                            continue;
                                        }
                                    }
                                    case 3: {
                                        $task2 = this.Controller1.ConnectFour$IController$Select(moves);
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
                                        $task3 = this.Controller2.ConnectFour$IController$Select(moves);
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
                                        m = $taskResult1;

                                        if (this.CheckForWin(m)) {
                                            System.Console.WriteLine("player " + System.Enum.toString(ConnectFour.Game.Chip, this.currentChip) + " wins!");
                                            !Bridge.staticEquals(this.OnUpdate, null) ? this.OnUpdate(this) : null;
                                            $step = 8;
                                            continue;
                                        }

                                        !Bridge.staticEquals(this.OnUpdate, null) ? this.OnUpdate(this) : null;

                                        this.currentChip = this.currentChip === ConnectFour.Game.Chip.C1 ? ConnectFour.Game.Chip.C2 : ConnectFour.Game.Chip.C1;

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
            CheckForWin: function (m) {
                var i;
                for (i = 0; i < ConnectFour.Game.rows; i = (i + 1) | 0) {
                    if (this.chips.get([i, m.Index]) !== 0) {
                        break;
                    }
                }
                this.chips.set([((i - 1) | 0), m.Index], this.currentChip);
                var row = (i - 1) | 0;
                var col = m.Index;

                if (this.Row(row, col, 0, 1) || this.Row(row, col, 1, 0) || this.Row(row, col, 1, 1) || this.Row(row, col, 1, -1)) {
                    return true;
                }

                return false;
            },
            Row: function (row, col, drow, dcol) {
                var C = null;
                C = Bridge.fn.bind(this, function (drow2, dcol2) {
                    var c = 0;
                    for (var i = 1; i < this.win; i = (i + 1) | 0) {
                        if (((col + Bridge.Int.mul(i, dcol2)) | 0) >= 0 && ((col + Bridge.Int.mul(i, dcol2)) | 0) < ConnectFour.Game.cols && ((row + Bridge.Int.mul(i, drow2)) | 0) >= 0 && ((row + Bridge.Int.mul(i, drow2)) | 0) < ConnectFour.Game.rows && this.chips.get([((row + Bridge.Int.mul(i, drow2)) | 0), ((col + Bridge.Int.mul(i, dcol2)) | 0)]) === this.currentChip) {
                            if (this.currentChip === this.chips.get([((row + Bridge.Int.mul(i, drow2)) | 0), ((col + Bridge.Int.mul(i, dcol2)) | 0)])) {
                                c = (c + 1) | 0;
                            } else {
                                break;
                            }
                        }
                    }
                    return c;
                });
                return ((((C(drow, dcol) + C(((-drow) | 0), ((-dcol) | 0))) | 0) + 1) | 0) >= this.win;


            }
        }
    });

    Bridge.define("ConnectFour.Game.Chip", {
        $kind: "nested enum",
        statics: {
            fields: {
                NONE: 0,
                C1: 1,
                C2: 2
            }
        }
    });

    Bridge.define("ConnectFour.IController", {
        $kind: "interface"
    });

    Bridge.define("ConnectFour.Move", {
        fields: {
            Index: 0
        }
    });

    Bridge.define("ConnectFour.Program", {
        main: function Main () {
            System.Console.WriteLine(System.String.format("Version: {0}", [ConnectFour.Version.Info]));

            ConnectFour.Program.canvas = document.createElement("canvas");

            var divElement = document.createElement("div");

            var createButton = function (index) {
                var $t;
                var button = ($t = document.createElement("button"), $t.onclick = function (e) {
                    !Bridge.staticEquals(ConnectFour.Program.Selection, null) ? ConnectFour.Program.Selection(index) : null;
                }, $t);
                button.style.width = "50px";
                button.style.height = "50px";
                button.style.marginRight = "10px";
                button.style.marginBottom = "10px";
                ConnectFour.Program.addColor(function (c) {
                    button.style.background = c;
                });

                return button;

            };


            divElement.appendChild(createButton(0));
            divElement.appendChild(createButton(1));
            divElement.appendChild(createButton(2));
            divElement.appendChild(createButton(3));
            divElement.appendChild(createButton(4));
            divElement.appendChild(createButton(5));
            divElement.appendChild(createButton(6));

            document.body.appendChild(divElement);
            document.body.appendChild(ConnectFour.Program.canvas);





            System.Console.WriteLine("Hello");


            var game = new ConnectFour.Game();

            ConnectFour.Program.Game_OnUpdate(game);
            !Bridge.staticEquals(ConnectFour.Program.Color, null) ? ConnectFour.Program.Color(game.currentChip === ConnectFour.Game.Chip.C1 ? "#f0f000" : "#00f0f0") : null;

            game.addOnUpdate(ConnectFour.Program.Game_OnUpdate);

            var controller1 = new ConnectFour.SomeController("Player 1");
            game.Controller1 = controller1;

            var controller2 = new ConnectFour.SomeController("Player 2");
            game.Controller2 = controller2;

            ConnectFour.Program.addSelection(function (e) {
                if (game.currentChip === ConnectFour.Game.Chip.C1) {
                    controller1.ButtonClick(e);
                } else {
                    controller2.ButtonClick(e);
                }
            });

            game.Run();
        },
        statics: {
            fields: {
                canvas: null
            },
            events: {
                Selection: null,
                Color: null
            },
            methods: {
                Game_OnUpdate: function (game) {
                    !Bridge.staticEquals(ConnectFour.Program.Color, null) ? ConnectFour.Program.Color(game.currentChip === ConnectFour.Game.Chip.C2 ? "#f0f000" : "#00f0f0") : null;

                    var ctx = ConnectFour.Program.canvas.getContext("2d");

                    ConnectFour.Program.canvas.width = 550;
                    ConnectFour.Program.canvas.height = 500;

                    for (var row = 0; row < System.Array.getLength(game.chips, 0); row = (row + 1) | 0) {
                        for (var col = 0; col < System.Array.getLength(game.chips, 1); col = (col + 1) | 0) {
                            var color = "#f0f0f0";

                            if (game.chips.get([row, col]) === ConnectFour.Game.Chip.C1) {
                                color = "#f0f000";
                            }

                            if (game.chips.get([row, col]) === ConnectFour.Game.Chip.C2) {
                                color = "#00f0f0";
                            }

                            ctx.fillStyle = color;
                            ctx.fillRect(Bridge.Int.mul(col, 60), Bridge.Int.mul(row, 60), 50, 50);
                        }
                    }
                }
            }
        }
    });

    Bridge.define("ConnectFour.Version", {
        statics: {
            fields: {
                Info: null
            },
            ctors: {
                init: function () {
                    this.Info = "1.0.7";
                }
            }
        }
    });

    Bridge.define("ConnectFour.SomeController", {
        inherits: [ConnectFour.IController],
        fields: {
            name: null,
            b: null
        },
        alias: ["Select", "ConnectFour$IController$Select"],
        ctors: {
            ctor: function (name) {
                this.$initialize();
                this.name = name;
            }
        },
        methods: {
            ButtonClick: function (index) {
                this.b != null ? this.b.setResult(index) : null;
            },
            Select: function (moves) {
                var $step = 0,
                    $task1, 
                    $taskResult1, 
                    $jumpFromFinally, 
                    $tcs = new System.Threading.Tasks.TaskCompletionSource(), 
                    $returnValue, 
                    list, 
                    mf, 
                    index, 
                    $async_e, 
                    $asyncBody = Bridge.fn.bind(this, function () {
                        try {
                            for (;;) {
                                $step = System.Array.min([0,1,2,3,4], $step);
                                switch ($step) {
                                    case 0: {
                                        list = Bridge.toArray(System.Linq.Enumerable.from(moves).select(function (m) {
                                            return m.Index;
                                        })).join(", ");
                                        
                                    }
                                    case 1: {
                                        this.b = new System.Threading.Tasks.TaskCompletionSource();

                                        $task1 = this.b.task;
                                        $step = 2;
                                        $task1.continueWith($asyncBody);
                                        return;
                                    }
                                    case 2: {
                                        $taskResult1 = $task1.getAwaitedResult();
                                        index = $taskResult1;
                                        $step = 3;
                                        continue;
                                    }
                                    case 3: {
                                        if ( ((mf = System.Linq.Enumerable.from(moves).singleOrDefault(function (m) {
                                            return m.Index === index;
                                        }, null))) == null ) {

                                            $step = 1;
                                            continue;
                                        }
                                        $step = 4;
                                        continue;
                                    }
                                    case 4: {
                                        $tcs.setResult(mf);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDb25uZWN0Rm91ci5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiR2FtZS5jcyIsIlByb2dyYW0uY3MiLCJDb250cm9sbGVyLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7bUNBcUI0QkE7NkJBS0hBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt3Q0FhckJBLFFBQW1CQSxLQUFJQTt3Q0FDdkJBLEtBQUtBLFdBQVdBLElBQUlBLHVCQUFNQTs0Q0FDekJBLElBQUlBLG1CQUFTQSxRQUFNQTtnREFDbEJBLFVBQVVBLFVBQUlBLCtCQUFlQTs7Ozt3Q0FFL0JBLElBQVNBLHFCQUFlQTs7Ozs7Ozs7O2lEQUFnQkEsZ0RBQW1CQTs7Ozs7Ozt1REFBekJBOzs7OztpREFBd0NBLGdEQUFtQkE7Ozs7Ozs7dURBQXpCQTs7Ozs7NENBQTNEQTs7d0NBRVRBLElBQUlBLGlCQUFZQTs0Q0FFZkEseUJBQWtCQSx3REFBWUE7NENBQzlCQSxvQ0FBVUEsUUFBS0EsQUFBcUNBLGNBQWdCQSxRQUFPQTs0Q0FDM0VBOzs7O3dDQUdEQSxvQ0FBVUEsUUFBS0EsQUFBcUNBLGNBQWdCQSxRQUFPQTs7d0NBRTNFQSxtQkFBY0EscUJBQWVBLDJCQUFVQSwyQkFBVUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzttQ0FJMUJBO2dCQUV4QkE7Z0JBQ0FBLEtBQUtBLE9BQU9BLElBQUlBLHVCQUFNQTtvQkFDckJBLElBQUlBLGdCQUFNQSxHQUFHQTt3QkFDWkE7OztnQkFDRkEsZ0JBQU1BLGVBQU9BLFVBQVdBO2dCQUN4QkEsVUFBVUE7Z0JBQ1ZBLFVBQVVBOztnQkFFVkEsSUFBSUEsU0FBSUEsS0FBS0EsY0FBY0EsU0FBSUEsS0FBS0EsY0FBY0EsU0FBSUEsS0FBS0EsY0FBY0EsU0FBSUEsS0FBS0EsUUFBUUE7b0JBQ3pGQTs7O2dCQUVEQTs7MkJBR2dCQSxLQUFTQSxLQUFTQSxNQUFVQTtnQkFFL0NBLFFBQStCQTtnQkFDL0JBLElBQUlBLCtCQUFDQSxPQUFPQTtvQkFFUkE7b0JBQ0FBLEtBQUtBLFdBQVdBLElBQUlBLFVBQUtBO3dCQUNyQkEsSUFBSUEsUUFBTUEsa0JBQUlBLHFCQUFjQSxRQUFNQSxrQkFBSUEsZUFBUUEseUJBQVFBLFFBQU1BLGtCQUFJQSxxQkFBY0EsUUFBTUEsa0JBQUlBLGVBQVFBLHlCQUFRQSxnQkFBTUEsUUFBTUEsa0JBQUlBLGNBQU9BLFFBQU1BLGtCQUFJQSxtQkFBVUE7NEJBQy9JQSxJQUFJQSxxQkFBZUEsZ0JBQU1BLFFBQU1BLGtCQUFJQSxjQUFPQSxRQUFNQSxrQkFBSUE7Z0NBQ2hEQTs7Z0NBRUFBOzs7O29CQUNaQSxPQUFPQTs7Z0JBSVJBLE9BQU9BLE1BQUVBLE1BQU1BLFFBQVFBLEVBQUVBLEdBQUNBLFlBQU1BLEdBQUNBLCtCQUFhQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lDdEU5Q0EseUJBQWtCQSxzQ0FBNkJBOztZQUUvQ0EsNkJBQVNBOztZQUVUQSxpQkFBaUJBOztZQUVqQkEsbUJBQTRDQSxVQUFDQTs7Z0JBRTVDQSxhQUFhQSxxREFFRkEsVUFBQ0E7b0JBQVFBLG9EQUFXQSxRQUFLQSxBQUFxQ0EsOEJBQWlCQSxTQUFRQTs7Z0JBRWxHQTtnQkFDQUE7Z0JBQ0FBO2dCQUNBQTtnQkFDQUEsNkJBQVNBLFVBQUNBO29CQUFNQSwwQkFBMEJBOzs7Z0JBRTFDQSxPQUFPQTs7Ozs7WUFLUkEsdUJBQXVCQTtZQUN2QkEsdUJBQXVCQTtZQUN2QkEsdUJBQXVCQTtZQUN2QkEsdUJBQXVCQTtZQUN2QkEsdUJBQXVCQTtZQUN2QkEsdUJBQXVCQTtZQUN2QkEsdUJBQXVCQTs7WUFFdkJBLDBCQUEwQkE7WUFDMUJBLDBCQUEwQkE7Ozs7OztZQU0xQkE7OztZQUdBQSxXQUFZQSxJQUFJQTs7WUFFaEJBLGtDQUFjQTtZQUNkQSxnREFBT0EsUUFBS0EsQUFBcUNBLDBCQUFhQSxxQkFBb0JBLG9EQUF1Q0E7O1lBRXpIQSxpQkFBaUJBOztZQUVqQkEsa0JBQWtCQSxJQUFJQTtZQUN0QkEsbUJBQW1CQTs7WUFFbkJBLGtCQUE2QkEsSUFBSUE7WUFDakNBLG1CQUFtQkE7O1lBRW5CQSxpQ0FBYUEsVUFBQ0E7Z0JBRWJBLElBQUlBLHFCQUFvQkE7b0JBQ3ZCQSx3QkFBd0JBOztvQkFFeEJBLHdCQUF3QkE7Ozs7WUFHMUJBOzs7Ozs7Ozs7Ozt5Q0FHaUNBO29CQUVqQ0EsZ0RBQU9BLFFBQUtBLEFBQXFDQSwwQkFBYUEscUJBQW9CQSxvREFBdUNBOztvQkFFekhBLFVBQVVBLEFBQTBCQTs7b0JBRXBDQTtvQkFDQUE7O29CQUVBQSxLQUFLQSxhQUFhQSxNQUFNQSx1Q0FBeUJBO3dCQUNoREEsS0FBS0EsYUFBYUEsTUFBTUEsdUNBQXlCQTs0QkFFaERBOzs0QkFFQUEsSUFBSUEsZ0JBQVdBLEtBQUtBLFVBQVFBO2dDQUUzQkE7Ozs0QkFHREEsSUFBSUEsZ0JBQVdBLEtBQUtBLFVBQVFBO2dDQUUzQkE7Ozs0QkFHREEsZ0JBQWdCQTs0QkFDaEJBLGFBQWFBLHlCQUFVQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztlQ3BGSUE7Ozs7NEJBTFJBOztnQkFFckJBLFlBQVlBOzs7O21DQUtXQTtnQkFFdkJBLFVBQUdBLE9BQUtBLEFBQXFDQSxpQkFBWUEsU0FBUUE7OzhCQUduQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O3dDQUU5QkEsT0FBY0EsZUFBdUJBLDRCQUF3Q0EsY0FBTUEsQUFBaUJBO21EQUFLQTs7d0NBR3pHQTs7O3dDQUVDQSxTQUFJQSxJQUFJQTs7d0NBRVJBLFNBQWNBOzs7Ozs7O3dDQUFkQSxRQUFRQTs7Ozs7NkNBQ0FBLENBQUNBLE1BQUtBLDRCQUE2Q0EsdUJBQU1BLEFBQWtCQTttREFBS0EsWUFBV0E7c0RBQVlBOzs7Ozs7Ozs7d0NBR2hIQSxlQUFPQSIsCiAgInNvdXJjZXNDb250ZW50IjogWyJ1c2luZyBTeXN0ZW07XG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcbnVzaW5nIFN5c3RlbS5MaW5xO1xudXNpbmcgU3lzdGVtLlRleHQ7XG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xuXG5uYW1lc3BhY2UgQ29ubmVjdEZvdXJcbntcblx0ZGVsZWdhdGUgdm9pZCBHYW1lVXBkYXRlSGFuZGxlcihHYW1lIGdhbWUpO1xuXG5cdGNsYXNzIEdhbWVcblx0e1xuXHRcdHB1YmxpYyBldmVudCBHYW1lVXBkYXRlSGFuZGxlciBPblVwZGF0ZTtcblxuXHRcdHB1YmxpYyBlbnVtIENoaXBcblx0XHR7XG5cdFx0XHROT05FLFxuXHRcdFx0QzEsXG5cdFx0XHRDMlxuXHRcdH1cblxuXHRcdHB1YmxpYyBDaGlwIGN1cnJlbnRDaGlwID0gQ2hpcC5DMTtcblxuXHRcdHByaXZhdGUgY29uc3QgaW50IHJvd3MgPSA2O1xuXHRcdHByaXZhdGUgY29uc3QgaW50IGNvbHMgPSA3O1xuXG5cdFx0cHVibGljIENoaXBbLF0gY2hpcHMgPSBuZXcgQ2hpcFtyb3dzLCBjb2xzXTtcblxuXHRcdHB1YmxpYyBJQ29udHJvbGxlciBDb250cm9sbGVyMSB7IGdldDsgc2V0OyB9XG5cblx0XHRwdWJsaWMgSUNvbnRyb2xsZXIgQ29udHJvbGxlcjIgeyBnZXQ7IHNldDsgfVxuXG5cdFx0cHJpdmF0ZSBpbnQgd2luID0gNDtcblxuXHRcdHB1YmxpYyBhc3luYyBUYXNrIFJ1bigpXG5cdFx0e1xuXHRcdFx0XG5cdFx0XHR3aGlsZSAodHJ1ZSlcblx0XHRcdHtcblx0XHRcdFx0TGlzdDxNb3ZlPiBtb3ZlcyA9IG5ldyBMaXN0PE1vdmU+KCk7XG5cdFx0XHRcdGZvciAoaW50IGkgPSAwOyBpIDwgY29sczsgaSsrKVxuXHRcdFx0XHRcdGlmIChjaGlwc1swLCBpXSA9PSBDaGlwLk5PTkUpXG5cdFx0XHRcdFx0XHRtb3Zlcy5BZGQobmV3IE1vdmUgeyBJbmRleCA9IGkgfSk7XG5cblx0XHRcdFx0TW92ZSBtID0gY3VycmVudENoaXAgPT0gQ2hpcC5DMSA/IGF3YWl0IENvbnRyb2xsZXIxLlNlbGVjdChtb3ZlcykgOiBhd2FpdCBDb250cm9sbGVyMi5TZWxlY3QobW92ZXMpO1xuXG5cdFx0XHRcdGlmIChDaGVja0ZvcldpbihtKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdENvbnNvbGUuV3JpdGVMaW5lKFwicGxheWVyIFwiICsgY3VycmVudENoaXAgKyBcIiB3aW5zIVwiKTtcblx0XHRcdFx0XHRPblVwZGF0ZSE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+T25VcGRhdGUuSW52b2tlKHRoaXMpKTpudWxsO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0T25VcGRhdGUhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9Pk9uVXBkYXRlLkludm9rZSh0aGlzKSk6bnVsbDtcblxuXHRcdFx0XHRjdXJyZW50Q2hpcCA9IGN1cnJlbnRDaGlwID09IENoaXAuQzEgPyBDaGlwLkMyIDogQ2hpcC5DMTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRwcml2YXRlIGJvb2wgQ2hlY2tGb3JXaW4oTW92ZSBtKVxuXHRcdHtcblx0XHRcdGludCBpO1xuXHRcdFx0Zm9yIChpID0gMDsgaSA8IHJvd3M7IGkrKylcblx0XHRcdFx0aWYgKGNoaXBzW2ksIG0uSW5kZXhdICE9IDApXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjaGlwc1tpIC0gMSwgbS5JbmRleF0gPSBjdXJyZW50Q2hpcDtcblx0XHRcdGludCByb3cgPSBpIC0gMTtcblx0XHRcdGludCBjb2wgPSBtLkluZGV4O1xuXG5cdFx0XHRpZiAoUm93KHJvdywgY29sLCAwLCAxKSB8fCBSb3cocm93LCBjb2wsIDEsIDApIHx8IFJvdyhyb3csIGNvbCwgMSwgMSkgfHwgUm93KHJvdywgY29sLCAxLCAtMSkpXG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cHJpdmF0ZSBib29sIFJvdyhpbnQgcm93LCBpbnQgY29sLCBpbnQgZHJvdywgaW50IGRjb2wpXG5cdFx0e1xuU3lzdGVtLkZ1bmM8aW50LCBpbnQsIGludD4gQyA9IG51bGw7XG5DID0gKGRyb3cyLCBkY29sMikgPT5cclxue1xyXG4gICAgaW50IGMgPSAwO1xyXG4gICAgZm9yIChpbnQgaSA9IDE7IGkgPCB3aW47IGkrKylcclxuICAgICAgICBpZiAoY29sICsgaSAqIGRjb2wyID49IDAgJiYgY29sICsgaSAqIGRjb2wyIDwgY29scyAmJiByb3cgKyBpICogZHJvdzIgPj0gMCAmJiByb3cgKyBpICogZHJvdzIgPCByb3dzICYmIGNoaXBzW3JvdyArIGkgKiBkcm93MiwgY29sICsgaSAqIGRjb2wyXSA9PSBjdXJyZW50Q2hpcClcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRDaGlwID09IGNoaXBzW3JvdyArIGkgKiBkcm93MiwgY29sICsgaSAqIGRjb2wyXSlcclxuICAgICAgICAgICAgICAgIGMrKztcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICByZXR1cm4gYztcclxufVxyXG5cclxuO1xuXHRcdFx0cmV0dXJuIEMoZHJvdywgZGNvbCkgKyBDKC1kcm93LCAtZGNvbCkgKyAxID49IHdpbjtcblxuXHRcdFx0XG5cdFx0fVxuXHR9XG59XG4iLCJ1c2luZyBCcmlkZ2UuSHRtbDU7XG51c2luZyBTeXN0ZW07XG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcbnVzaW5nIFN5c3RlbS5MaW5xO1xudXNpbmcgU3lzdGVtLlRleHQ7XG51c2luZyBTeXN0ZW0uVGhyZWFkaW5nLlRhc2tzO1xuXG5uYW1lc3BhY2UgQ29ubmVjdEZvdXJcbntcblx0cHVibGljIGNsYXNzIFByb2dyYW1cblx0e1xuXHRcdHB1YmxpYyBkZWxlZ2F0ZSB2b2lkIEJ1dHRvbkhhbmRsZXIoaW50IGluZGV4KTtcblx0XHRwdWJsaWMgZGVsZWdhdGUgdm9pZCBDb2xvckhhbmRsZXIoc3RyaW5nIGNvbG9yKTtcblxuXHRcdHN0YXRpYyBIVE1MQ2FudmFzRWxlbWVudCBjYW52YXM7XG5cdFx0c3RhdGljIGV2ZW50IEJ1dHRvbkhhbmRsZXIgU2VsZWN0aW9uO1xuXHRcdHN0YXRpYyBldmVudCBDb2xvckhhbmRsZXIgQ29sb3I7XG5cblxuXHRcdHB1YmxpYyBzdGF0aWMgdm9pZCBNYWluKClcblx0XHR7XG5cdFx0XHRDb25zb2xlLldyaXRlTGluZShzdHJpbmcuRm9ybWF0KFwiVmVyc2lvbjogezB9XCIsVmVyc2lvbi5JbmZvKSk7XG5cblx0XHRcdGNhbnZhcyA9IG5ldyBIVE1MQ2FudmFzRWxlbWVudCgpO1xuXG5cdFx0XHR2YXIgZGl2RWxlbWVudCA9IG5ldyBIVE1MRGl2RWxlbWVudCgpO1xuXG5cdFx0XHRGdW5jPGludCwgSFRNTEJ1dHRvbkVsZW1lbnQ+IGNyZWF0ZUJ1dHRvbiA9IChpbnQgaW5kZXgpID0+XG5cdFx0XHR7XG5cdFx0XHRcdHZhciBidXR0b24gPSBuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcblx0XHRcdFx0e1xuXHRcdFx0XHRcdE9uQ2xpY2sgPSAoZSkgPT4geyBTZWxlY3Rpb24hPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PlNlbGVjdGlvbi5JbnZva2UoaW5kZXgpKTpudWxsOyB9XG5cdFx0XHRcdH07XG5cdFx0XHRcdGJ1dHRvbi5TdHlsZS5XaWR0aCA9IFwiNTBweFwiO1xuXHRcdFx0XHRidXR0b24uU3R5bGUuSGVpZ2h0ID0gXCI1MHB4XCI7XG5cdFx0XHRcdGJ1dHRvbi5TdHlsZS5NYXJnaW5SaWdodCA9IFwiMTBweFwiO1xuXHRcdFx0XHRidXR0b24uU3R5bGUuTWFyZ2luQm90dG9tID0gXCIxMHB4XCI7XG5cdFx0XHRcdENvbG9yICs9IChjKSA9PiBidXR0b24uU3R5bGUuQmFja2dyb3VuZCA9IGM7XG5cblx0XHRcdFx0cmV0dXJuIGJ1dHRvbjtcblxuXHRcdFx0fTtcblxuXG5cdFx0XHRkaXZFbGVtZW50LkFwcGVuZENoaWxkKGNyZWF0ZUJ1dHRvbigwKSk7XG5cdFx0XHRkaXZFbGVtZW50LkFwcGVuZENoaWxkKGNyZWF0ZUJ1dHRvbigxKSk7XG5cdFx0XHRkaXZFbGVtZW50LkFwcGVuZENoaWxkKGNyZWF0ZUJ1dHRvbigyKSk7XG5cdFx0XHRkaXZFbGVtZW50LkFwcGVuZENoaWxkKGNyZWF0ZUJ1dHRvbigzKSk7XG5cdFx0XHRkaXZFbGVtZW50LkFwcGVuZENoaWxkKGNyZWF0ZUJ1dHRvbig0KSk7XG5cdFx0XHRkaXZFbGVtZW50LkFwcGVuZENoaWxkKGNyZWF0ZUJ1dHRvbig1KSk7XG5cdFx0XHRkaXZFbGVtZW50LkFwcGVuZENoaWxkKGNyZWF0ZUJ1dHRvbig2KSk7XG5cblx0XHRcdERvY3VtZW50LkJvZHkuQXBwZW5kQ2hpbGQoZGl2RWxlbWVudCk7XG5cdFx0XHREb2N1bWVudC5Cb2R5LkFwcGVuZENoaWxkKGNhbnZhcyk7XG5cblxuXG5cblxuXHRcdFx0Q29uc29sZS5Xcml0ZUxpbmUoXCJIZWxsb1wiKTtcblxuXG5cdFx0XHRHYW1lIGdhbWUgPSBuZXcgR2FtZSgpO1xuXG5cdFx0XHRHYW1lX09uVXBkYXRlKGdhbWUpO1xuXHRcdFx0Q29sb3IhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PkNvbG9yLkludm9rZShnYW1lLmN1cnJlbnRDaGlwID09IEdhbWUuQ2hpcC5DMSA/IFwiI2YwZjAwMFwiIDogXCIjMDBmMGYwXCIpKTpudWxsO1xuXG5cdFx0XHRnYW1lLk9uVXBkYXRlICs9IEdhbWVfT25VcGRhdGU7XG5cblx0XHRcdHZhciBjb250cm9sbGVyMSA9IG5ldyBTb21lQ29udHJvbGxlcihcIlBsYXllciAxXCIpO1xuXHRcdFx0Z2FtZS5Db250cm9sbGVyMSA9IGNvbnRyb2xsZXIxO1xuXG5cdFx0XHRTb21lQ29udHJvbGxlciBjb250cm9sbGVyMiA9IG5ldyBTb21lQ29udHJvbGxlcihcIlBsYXllciAyXCIpO1xuXHRcdFx0Z2FtZS5Db250cm9sbGVyMiA9IGNvbnRyb2xsZXIyO1xuXG5cdFx0XHRTZWxlY3Rpb24gKz0gKGUpID0+XG5cdFx0XHR7XG5cdFx0XHRcdGlmIChnYW1lLmN1cnJlbnRDaGlwID09IEdhbWUuQ2hpcC5DMSlcblx0XHRcdFx0XHRjb250cm9sbGVyMS5CdXR0b25DbGljayhlKTtcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGNvbnRyb2xsZXIyLkJ1dHRvbkNsaWNrKGUpO1xuXHRcdFx0fTtcblxuXHRcdFx0Z2FtZS5SdW4oKTtcblx0XHR9XG5cblx0XHRwcml2YXRlIHN0YXRpYyB2b2lkIEdhbWVfT25VcGRhdGUoR2FtZSBnYW1lKVxuXHRcdHtcblx0XHRcdENvbG9yIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT5Db2xvci5JbnZva2UoZ2FtZS5jdXJyZW50Q2hpcCA9PSBHYW1lLkNoaXAuQzIgPyBcIiNmMGYwMDBcIiA6IFwiIzAwZjBmMFwiKSk6bnVsbDtcblxuXHRcdFx0dmFyIGN0eCA9IChDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpY2FudmFzLkdldENvbnRleHQoXCIyZFwiKTtcblxuXHRcdFx0Y2FudmFzLldpZHRoID0gNTUwO1xuXHRcdFx0Y2FudmFzLkhlaWdodCA9IDUwMDtcblxuXHRcdFx0Zm9yIChpbnQgcm93ID0gMDsgcm93IDwgZ2FtZS5jaGlwcy5HZXRMZW5ndGgoMCk7IHJvdysrKVxuXHRcdFx0XHRmb3IgKGludCBjb2wgPSAwOyBjb2wgPCBnYW1lLmNoaXBzLkdldExlbmd0aCgxKTsgY29sKyspXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRzdHJpbmcgY29sb3IgPSBcIiNmMGYwZjBcIjtcblxuXHRcdFx0XHRcdGlmIChnYW1lLmNoaXBzW3JvdywgY29sXSA9PSBHYW1lLkNoaXAuQzEpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29sb3IgPSBcIiNmMGYwMDBcIjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoZ2FtZS5jaGlwc1tyb3csIGNvbF0gPT0gR2FtZS5DaGlwLkMyKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGNvbG9yID0gXCIjMDBmMGYwXCI7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Y3R4LkZpbGxTdHlsZSA9IGNvbG9yO1xuXHRcdFx0XHRcdGN0eC5GaWxsUmVjdChjb2wgKiA2MCwgcm93ICogNjAsIDUwLCA1MCk7XG5cdFx0XHRcdH1cblx0XHR9XG5cdH1cbn1cbiIsInVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xudXNpbmcgU3lzdGVtLkxpbnE7XG51c2luZyBTeXN0ZW0uVGV4dDtcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XG5cbm5hbWVzcGFjZSBDb25uZWN0Rm91clxue1xuXHRjbGFzcyBNb3ZlXG5cdHtcblx0XHRwdWJsaWMgaW50IEluZGV4IHsgZ2V0OyBzZXQ7IH1cblx0fVxuXG5cdGludGVyZmFjZSBJQ29udHJvbGxlclxuXHR7XG5cdFx0VGFzazxNb3ZlPiBTZWxlY3QoSUVudW1lcmFibGU8TW92ZT4gbW92ZXMpO1xuXHR9XG5cblx0Y2xhc3MgU29tZUNvbnRyb2xsZXIgOiBJQ29udHJvbGxlclxuXHR7XG5cdFx0cHJpdmF0ZSByZWFkb25seSBzdHJpbmcgbmFtZTtcblxuXHRcdHB1YmxpYyBTb21lQ29udHJvbGxlcihzdHJpbmcgbmFtZSlcblx0XHR7XG5cdFx0XHR0aGlzLm5hbWUgPSBuYW1lO1xuXHRcdH1cblxuXHRcdFRhc2tDb21wbGV0aW9uU291cmNlPGludD4gYiA9IG51bGw7XG5cblx0XHRwdWJsaWMgdm9pZCBCdXR0b25DbGljayhpbnQgaW5kZXgpXG5cdFx0e1xuXHRcdFx0YiE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+Yi5TZXRSZXN1bHQoaW5kZXgpKTpudWxsO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBhc3luYyBUYXNrPE1vdmU+IFNlbGVjdChJRW51bWVyYWJsZTxNb3ZlPiBtb3Zlcylcblx0XHR7XG5cdFx0XHRzdHJpbmcgbGlzdCA9IHN0cmluZy5Kb2luPGludD4oXCIsIFwiLCBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNlbGVjdDxNb3ZlLGludD4obW92ZXMsKEZ1bmM8TW92ZSxpbnQ+KShtID0+IG0uSW5kZXgpKSk7XG5cdFx0XHRNb3ZlIG1mO1xuXHRcdFx0aW50IGluZGV4O1xuXHRcdFx0ZG9cblx0XHRcdHtcblx0XHRcdFx0YiA9IG5ldyBUYXNrQ29tcGxldGlvblNvdXJjZTxpbnQ+KCk7XG5cblx0XHRcdFx0aW5kZXggPSBhd2FpdCBiLlRhc2s7XG5cdFx0XHR9IHdoaWxlICgobWYgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNpbmdsZU9yRGVmYXVsdDxNb3ZlPihtb3ZlcywoRnVuYzxNb3ZlLGJvb2w+KShtID0+IG0uSW5kZXggPT0gaW5kZXgpKSkgPT0gbnVsbCk7XG5cblx0XHRcdC8vQ29uc29sZS5Xcml0ZUxpbmUoJFwie25hbWV9IGNob3NlIGNvbHVtbiB7aW5kZXggKyAxfS5cIik7XG5cdFx0XHRyZXR1cm4gbWY7XG5cdFx0fVxuXHR9XG59XG4iXQp9Cg==
