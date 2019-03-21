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
            ConnectFour.Program.canvas = document.createElement("canvas");

            var divElement = document.createElement("div");

            var createButton = function (index) {
                var $t;
                var button = ($t = document.createElement("button"), $t.innerHTML = Bridge.toString((((index + 1) | 0))), $t.onclick = function (e) {
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
                    this.Info = "1.0.5";
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDb25uZWN0Rm91ci5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiR2FtZS5jcyIsIlByb2dyYW0uY3MiLCJDb250cm9sbGVyLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7bUNBcUI0QkE7NkJBS0hBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt3Q0FhckJBLFFBQW1CQSxLQUFJQTt3Q0FDdkJBLEtBQUtBLFdBQVdBLElBQUlBLHVCQUFNQTs0Q0FDekJBLElBQUlBLG1CQUFTQSxRQUFNQTtnREFDbEJBLFVBQVVBLFVBQUlBLCtCQUFlQTs7Ozt3Q0FFL0JBLElBQVNBLHFCQUFlQTs7Ozs7Ozs7O2lEQUFnQkEsZ0RBQW1CQTs7Ozs7Ozt1REFBekJBOzs7OztpREFBd0NBLGdEQUFtQkE7Ozs7Ozs7dURBQXpCQTs7Ozs7NENBQTNEQTs7d0NBRVRBLElBQUlBLGlCQUFZQTs0Q0FFZkEseUJBQWtCQSx3REFBWUE7NENBQzlCQSxvQ0FBVUEsUUFBS0EsQUFBcUNBLGNBQWdCQSxRQUFPQTs0Q0FDM0VBOzs7O3dDQUdEQSxvQ0FBVUEsUUFBS0EsQUFBcUNBLGNBQWdCQSxRQUFPQTs7d0NBRTNFQSxtQkFBY0EscUJBQWVBLDJCQUFVQSwyQkFBVUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzttQ0FJMUJBO2dCQUV4QkE7Z0JBQ0FBLEtBQUtBLE9BQU9BLElBQUlBLHVCQUFNQTtvQkFDckJBLElBQUlBLGdCQUFNQSxHQUFHQTt3QkFDWkE7OztnQkFDRkEsZ0JBQU1BLGVBQU9BLFVBQVdBO2dCQUN4QkEsVUFBVUE7Z0JBQ1ZBLFVBQVVBOztnQkFFVkEsSUFBSUEsU0FBSUEsS0FBS0EsY0FBY0EsU0FBSUEsS0FBS0EsY0FBY0EsU0FBSUEsS0FBS0EsY0FBY0EsU0FBSUEsS0FBS0EsUUFBUUE7b0JBQ3pGQTs7O2dCQUVEQTs7MkJBR2dCQSxLQUFTQSxLQUFTQSxNQUFVQTtnQkFFL0NBLFFBQStCQTtnQkFDL0JBLElBQUlBLCtCQUFDQSxPQUFPQTtvQkFFUkE7b0JBQ0FBLEtBQUtBLFdBQVdBLElBQUlBLFVBQUtBO3dCQUNyQkEsSUFBSUEsUUFBTUEsa0JBQUlBLHFCQUFjQSxRQUFNQSxrQkFBSUEsZUFBUUEseUJBQVFBLFFBQU1BLGtCQUFJQSxxQkFBY0EsUUFBTUEsa0JBQUlBLGVBQVFBLHlCQUFRQSxnQkFBTUEsUUFBTUEsa0JBQUlBLGNBQU9BLFFBQU1BLGtCQUFJQSxtQkFBVUE7NEJBQy9JQSxJQUFJQSxxQkFBZUEsZ0JBQU1BLFFBQU1BLGtCQUFJQSxjQUFPQSxRQUFNQSxrQkFBSUE7Z0NBQ2hEQTs7Z0NBRUFBOzs7O29CQUNaQSxPQUFPQTs7Z0JBSVJBLE9BQU9BLE1BQUVBLE1BQU1BLFFBQVFBLEVBQUVBLEdBQUNBLFlBQU1BLEdBQUNBLCtCQUFhQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lDdEU5Q0EsNkJBQVNBOztZQUVUQSxpQkFBaUJBOztZQUVqQkEsbUJBQTRDQSxVQUFDQTs7Z0JBRTVDQSxhQUFhQSx1REFFQUEsaUJBQUNBLGtDQUNIQSxVQUFDQTtvQkFBUUEsb0RBQVdBLFFBQUtBLEFBQXFDQSw4QkFBaUJBLFNBQVFBOztnQkFFbEdBO2dCQUNBQTtnQkFDQUE7Z0JBQ0FBO2dCQUNBQSw2QkFBU0EsVUFBQ0E7b0JBQU1BLDBCQUEwQkE7OztnQkFFMUNBLE9BQU9BOzs7OztZQUtSQSx1QkFBdUJBO1lBQ3ZCQSx1QkFBdUJBO1lBQ3ZCQSx1QkFBdUJBO1lBQ3ZCQSx1QkFBdUJBO1lBQ3ZCQSx1QkFBdUJBO1lBQ3ZCQSx1QkFBdUJBO1lBQ3ZCQSx1QkFBdUJBOztZQUV2QkEsMEJBQTBCQTtZQUMxQkEsMEJBQTBCQTs7Ozs7O1lBTTFCQTs7O1lBR0FBLFdBQVlBLElBQUlBOztZQUVoQkEsa0NBQWNBO1lBQ2RBLGdEQUFPQSxRQUFLQSxBQUFxQ0EsMEJBQWFBLHFCQUFvQkEsb0RBQXVDQTs7WUFFekhBLGlCQUFpQkE7O1lBRWpCQSxrQkFBa0JBLElBQUlBO1lBQ3RCQSxtQkFBbUJBOztZQUVuQkEsa0JBQTZCQSxJQUFJQTtZQUNqQ0EsbUJBQW1CQTs7WUFFbkJBLGlDQUFhQSxVQUFDQTtnQkFFYkEsSUFBSUEscUJBQW9CQTtvQkFDdkJBLHdCQUF3QkE7O29CQUV4QkEsd0JBQXdCQTs7OztZQUcxQkE7Ozs7Ozs7Ozs7O3lDQUdpQ0E7b0JBRWpDQSxnREFBT0EsUUFBS0EsQUFBcUNBLDBCQUFhQSxxQkFBb0JBLG9EQUF1Q0E7O29CQUV6SEEsVUFBVUEsQUFBMEJBOztvQkFFcENBO29CQUNBQTs7b0JBRUFBLEtBQUtBLGFBQWFBLE1BQU1BLHVDQUF5QkE7d0JBQ2hEQSxLQUFLQSxhQUFhQSxNQUFNQSx1Q0FBeUJBOzRCQUVoREE7OzRCQUVBQSxJQUFJQSxnQkFBV0EsS0FBS0EsVUFBUUE7Z0NBRTNCQTs7OzRCQUdEQSxJQUFJQSxnQkFBV0EsS0FBS0EsVUFBUUE7Z0NBRTNCQTs7OzRCQUdEQSxnQkFBZ0JBOzRCQUNoQkEsYUFBYUEseUJBQVVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2VDbkZJQTs7Ozs0QkFMUkE7O2dCQUVyQkEsWUFBWUE7Ozs7bUNBS1dBO2dCQUV2QkEsVUFBR0EsT0FBS0EsQUFBcUNBLGlCQUFZQSxTQUFRQTs7OEJBR25DQTs7Ozs7Ozs7Ozs7Ozs7Ozs7d0NBRTlCQSxPQUFjQSxlQUF1QkEsNEJBQXdDQSxjQUFNQSxBQUFpQkE7bURBQUtBOzt3Q0FHekdBOzs7d0NBRUNBLFNBQUlBLElBQUlBOzt3Q0FFUkEsU0FBY0E7Ozs7Ozs7d0NBQWRBLFFBQVFBOzs7Ozs2Q0FDQUEsQ0FBQ0EsTUFBS0EsNEJBQTZDQSx1QkFBTUEsQUFBa0JBO21EQUFLQSxZQUFXQTtzREFBWUE7Ozs7Ozs7Ozt3Q0FHaEhBLGVBQU9BIiwKICAic291cmNlc0NvbnRlbnQiOiBbInVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xudXNpbmcgU3lzdGVtLkxpbnE7XG51c2luZyBTeXN0ZW0uVGV4dDtcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XG5cbm5hbWVzcGFjZSBDb25uZWN0Rm91clxue1xuXHRkZWxlZ2F0ZSB2b2lkIEdhbWVVcGRhdGVIYW5kbGVyKEdhbWUgZ2FtZSk7XG5cblx0Y2xhc3MgR2FtZVxuXHR7XG5cdFx0cHVibGljIGV2ZW50IEdhbWVVcGRhdGVIYW5kbGVyIE9uVXBkYXRlO1xuXG5cdFx0cHVibGljIGVudW0gQ2hpcFxuXHRcdHtcblx0XHRcdE5PTkUsXG5cdFx0XHRDMSxcblx0XHRcdEMyXG5cdFx0fVxuXG5cdFx0cHVibGljIENoaXAgY3VycmVudENoaXAgPSBDaGlwLkMxO1xuXG5cdFx0cHJpdmF0ZSBjb25zdCBpbnQgcm93cyA9IDY7XG5cdFx0cHJpdmF0ZSBjb25zdCBpbnQgY29scyA9IDc7XG5cblx0XHRwdWJsaWMgQ2hpcFssXSBjaGlwcyA9IG5ldyBDaGlwW3Jvd3MsIGNvbHNdO1xuXG5cdFx0cHVibGljIElDb250cm9sbGVyIENvbnRyb2xsZXIxIHsgZ2V0OyBzZXQ7IH1cblxuXHRcdHB1YmxpYyBJQ29udHJvbGxlciBDb250cm9sbGVyMiB7IGdldDsgc2V0OyB9XG5cblx0XHRwcml2YXRlIGludCB3aW4gPSA0O1xuXG5cdFx0cHVibGljIGFzeW5jIFRhc2sgUnVuKClcblx0XHR7XG5cdFx0XHRcblx0XHRcdHdoaWxlICh0cnVlKVxuXHRcdFx0e1xuXHRcdFx0XHRMaXN0PE1vdmU+IG1vdmVzID0gbmV3IExpc3Q8TW92ZT4oKTtcblx0XHRcdFx0Zm9yIChpbnQgaSA9IDA7IGkgPCBjb2xzOyBpKyspXG5cdFx0XHRcdFx0aWYgKGNoaXBzWzAsIGldID09IENoaXAuTk9ORSlcblx0XHRcdFx0XHRcdG1vdmVzLkFkZChuZXcgTW92ZSB7IEluZGV4ID0gaSB9KTtcblxuXHRcdFx0XHRNb3ZlIG0gPSBjdXJyZW50Q2hpcCA9PSBDaGlwLkMxID8gYXdhaXQgQ29udHJvbGxlcjEuU2VsZWN0KG1vdmVzKSA6IGF3YWl0IENvbnRyb2xsZXIyLlNlbGVjdChtb3Zlcyk7XG5cblx0XHRcdFx0aWYgKENoZWNrRm9yV2luKG0pKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Q29uc29sZS5Xcml0ZUxpbmUoXCJwbGF5ZXIgXCIgKyBjdXJyZW50Q2hpcCArIFwiIHdpbnMhXCIpO1xuXHRcdFx0XHRcdE9uVXBkYXRlIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT5PblVwZGF0ZS5JbnZva2UodGhpcykpOm51bGw7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRPblVwZGF0ZSE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+T25VcGRhdGUuSW52b2tlKHRoaXMpKTpudWxsO1xuXG5cdFx0XHRcdGN1cnJlbnRDaGlwID0gY3VycmVudENoaXAgPT0gQ2hpcC5DMSA/IENoaXAuQzIgOiBDaGlwLkMxO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHByaXZhdGUgYm9vbCBDaGVja0ZvcldpbihNb3ZlIG0pXG5cdFx0e1xuXHRcdFx0aW50IGk7XG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgcm93czsgaSsrKVxuXHRcdFx0XHRpZiAoY2hpcHNbaSwgbS5JbmRleF0gIT0gMClcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdGNoaXBzW2kgLSAxLCBtLkluZGV4XSA9IGN1cnJlbnRDaGlwO1xuXHRcdFx0aW50IHJvdyA9IGkgLSAxO1xuXHRcdFx0aW50IGNvbCA9IG0uSW5kZXg7XG5cblx0XHRcdGlmIChSb3cocm93LCBjb2wsIDAsIDEpIHx8IFJvdyhyb3csIGNvbCwgMSwgMCkgfHwgUm93KHJvdywgY29sLCAxLCAxKSB8fCBSb3cocm93LCBjb2wsIDEsIC0xKSlcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRwcml2YXRlIGJvb2wgUm93KGludCByb3csIGludCBjb2wsIGludCBkcm93LCBpbnQgZGNvbClcblx0XHR7XG5TeXN0ZW0uRnVuYzxpbnQsIGludCwgaW50PiBDID0gbnVsbDtcbkMgPSAoZHJvdzIsIGRjb2wyKSA9PlxyXG57XHJcbiAgICBpbnQgYyA9IDA7XHJcbiAgICBmb3IgKGludCBpID0gMTsgaSA8IHdpbjsgaSsrKVxyXG4gICAgICAgIGlmIChjb2wgKyBpICogZGNvbDIgPj0gMCAmJiBjb2wgKyBpICogZGNvbDIgPCBjb2xzICYmIHJvdyArIGkgKiBkcm93MiA+PSAwICYmIHJvdyArIGkgKiBkcm93MiA8IHJvd3MgJiYgY2hpcHNbcm93ICsgaSAqIGRyb3cyLCBjb2wgKyBpICogZGNvbDJdID09IGN1cnJlbnRDaGlwKVxyXG4gICAgICAgICAgICBpZiAoY3VycmVudENoaXAgPT0gY2hpcHNbcm93ICsgaSAqIGRyb3cyLCBjb2wgKyBpICogZGNvbDJdKVxyXG4gICAgICAgICAgICAgICAgYysrO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgIHJldHVybiBjO1xyXG59XHJcblxyXG47XG5cdFx0XHRyZXR1cm4gQyhkcm93LCBkY29sKSArIEMoLWRyb3csIC1kY29sKSArIDEgPj0gd2luO1xuXG5cdFx0XHRcblx0XHR9XG5cdH1cbn1cbiIsInVzaW5nIEJyaWRnZS5IdG1sNTtcbnVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xudXNpbmcgU3lzdGVtLkxpbnE7XG51c2luZyBTeXN0ZW0uVGV4dDtcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XG5cbm5hbWVzcGFjZSBDb25uZWN0Rm91clxue1xuXHRwdWJsaWMgY2xhc3MgUHJvZ3JhbVxuXHR7XG5cdFx0cHVibGljIGRlbGVnYXRlIHZvaWQgQnV0dG9uSGFuZGxlcihpbnQgaW5kZXgpO1xuXHRcdHB1YmxpYyBkZWxlZ2F0ZSB2b2lkIENvbG9ySGFuZGxlcihzdHJpbmcgY29sb3IpO1xuXG5cdFx0c3RhdGljIEhUTUxDYW52YXNFbGVtZW50IGNhbnZhcztcblx0XHRzdGF0aWMgZXZlbnQgQnV0dG9uSGFuZGxlciBTZWxlY3Rpb247XG5cdFx0c3RhdGljIGV2ZW50IENvbG9ySGFuZGxlciBDb2xvcjtcblxuXG5cdFx0cHVibGljIHN0YXRpYyB2b2lkIE1haW4oKVxuXHRcdHtcblx0XHRcdGNhbnZhcyA9IG5ldyBIVE1MQ2FudmFzRWxlbWVudCgpO1xuXG5cdFx0XHR2YXIgZGl2RWxlbWVudCA9IG5ldyBIVE1MRGl2RWxlbWVudCgpO1xuXG5cdFx0XHRGdW5jPGludCwgSFRNTEJ1dHRvbkVsZW1lbnQ+IGNyZWF0ZUJ1dHRvbiA9IChpbnQgaW5kZXgpID0+XG5cdFx0XHR7XG5cdFx0XHRcdHZhciBidXR0b24gPSBuZXcgSFRNTEJ1dHRvbkVsZW1lbnRcblx0XHRcdFx0e1xuXHRcdFx0XHRcdElubmVySFRNTCA9IChpbmRleCArIDEpLlRvU3RyaW5nKCksXG5cdFx0XHRcdFx0T25DbGljayA9IChlKSA9PiB7IFNlbGVjdGlvbiE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+U2VsZWN0aW9uLkludm9rZShpbmRleCkpOm51bGw7IH1cblx0XHRcdFx0fTtcblx0XHRcdFx0YnV0dG9uLlN0eWxlLldpZHRoID0gXCI1MHB4XCI7XG5cdFx0XHRcdGJ1dHRvbi5TdHlsZS5IZWlnaHQgPSBcIjUwcHhcIjtcblx0XHRcdFx0YnV0dG9uLlN0eWxlLk1hcmdpblJpZ2h0ID0gXCIxMHB4XCI7XG5cdFx0XHRcdGJ1dHRvbi5TdHlsZS5NYXJnaW5Cb3R0b20gPSBcIjEwcHhcIjtcblx0XHRcdFx0Q29sb3IgKz0gKGMpID0+IGJ1dHRvbi5TdHlsZS5CYWNrZ3JvdW5kID0gYztcblxuXHRcdFx0XHRyZXR1cm4gYnV0dG9uO1xuXG5cdFx0XHR9O1xuXG5cblx0XHRcdGRpdkVsZW1lbnQuQXBwZW5kQ2hpbGQoY3JlYXRlQnV0dG9uKDApKTtcblx0XHRcdGRpdkVsZW1lbnQuQXBwZW5kQ2hpbGQoY3JlYXRlQnV0dG9uKDEpKTtcblx0XHRcdGRpdkVsZW1lbnQuQXBwZW5kQ2hpbGQoY3JlYXRlQnV0dG9uKDIpKTtcblx0XHRcdGRpdkVsZW1lbnQuQXBwZW5kQ2hpbGQoY3JlYXRlQnV0dG9uKDMpKTtcblx0XHRcdGRpdkVsZW1lbnQuQXBwZW5kQ2hpbGQoY3JlYXRlQnV0dG9uKDQpKTtcblx0XHRcdGRpdkVsZW1lbnQuQXBwZW5kQ2hpbGQoY3JlYXRlQnV0dG9uKDUpKTtcblx0XHRcdGRpdkVsZW1lbnQuQXBwZW5kQ2hpbGQoY3JlYXRlQnV0dG9uKDYpKTtcblxuXHRcdFx0RG9jdW1lbnQuQm9keS5BcHBlbmRDaGlsZChkaXZFbGVtZW50KTtcblx0XHRcdERvY3VtZW50LkJvZHkuQXBwZW5kQ2hpbGQoY2FudmFzKTtcblxuXG5cblxuXG5cdFx0XHRDb25zb2xlLldyaXRlTGluZShcIkhlbGxvXCIpO1xuXG5cblx0XHRcdEdhbWUgZ2FtZSA9IG5ldyBHYW1lKCk7XG5cblx0XHRcdEdhbWVfT25VcGRhdGUoZ2FtZSk7XG5cdFx0XHRDb2xvciE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+Q29sb3IuSW52b2tlKGdhbWUuY3VycmVudENoaXAgPT0gR2FtZS5DaGlwLkMxID8gXCIjZjBmMDAwXCIgOiBcIiMwMGYwZjBcIikpOm51bGw7XG5cblx0XHRcdGdhbWUuT25VcGRhdGUgKz0gR2FtZV9PblVwZGF0ZTtcblxuXHRcdFx0dmFyIGNvbnRyb2xsZXIxID0gbmV3IFNvbWVDb250cm9sbGVyKFwiUGxheWVyIDFcIik7XG5cdFx0XHRnYW1lLkNvbnRyb2xsZXIxID0gY29udHJvbGxlcjE7XG5cblx0XHRcdFNvbWVDb250cm9sbGVyIGNvbnRyb2xsZXIyID0gbmV3IFNvbWVDb250cm9sbGVyKFwiUGxheWVyIDJcIik7XG5cdFx0XHRnYW1lLkNvbnRyb2xsZXIyID0gY29udHJvbGxlcjI7XG5cblx0XHRcdFNlbGVjdGlvbiArPSAoZSkgPT5cblx0XHRcdHtcblx0XHRcdFx0aWYgKGdhbWUuY3VycmVudENoaXAgPT0gR2FtZS5DaGlwLkMxKVxuXHRcdFx0XHRcdGNvbnRyb2xsZXIxLkJ1dHRvbkNsaWNrKGUpO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0Y29udHJvbGxlcjIuQnV0dG9uQ2xpY2soZSk7XG5cdFx0XHR9O1xuXG5cdFx0XHRnYW1lLlJ1bigpO1xuXHRcdH1cblxuXHRcdHByaXZhdGUgc3RhdGljIHZvaWQgR2FtZV9PblVwZGF0ZShHYW1lIGdhbWUpXG5cdFx0e1xuXHRcdFx0Q29sb3IhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PkNvbG9yLkludm9rZShnYW1lLmN1cnJlbnRDaGlwID09IEdhbWUuQ2hpcC5DMiA/IFwiI2YwZjAwMFwiIDogXCIjMDBmMGYwXCIpKTpudWxsO1xuXG5cdFx0XHR2YXIgY3R4ID0gKENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCljYW52YXMuR2V0Q29udGV4dChcIjJkXCIpO1xuXG5cdFx0XHRjYW52YXMuV2lkdGggPSA1NTA7XG5cdFx0XHRjYW52YXMuSGVpZ2h0ID0gNTAwO1xuXG5cdFx0XHRmb3IgKGludCByb3cgPSAwOyByb3cgPCBnYW1lLmNoaXBzLkdldExlbmd0aCgwKTsgcm93KyspXG5cdFx0XHRcdGZvciAoaW50IGNvbCA9IDA7IGNvbCA8IGdhbWUuY2hpcHMuR2V0TGVuZ3RoKDEpOyBjb2wrKylcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHN0cmluZyBjb2xvciA9IFwiI2YwZjBmMFwiO1xuXG5cdFx0XHRcdFx0aWYgKGdhbWUuY2hpcHNbcm93LCBjb2xdID09IEdhbWUuQ2hpcC5DMSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjb2xvciA9IFwiI2YwZjAwMFwiO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChnYW1lLmNoaXBzW3JvdywgY29sXSA9PSBHYW1lLkNoaXAuQzIpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29sb3IgPSBcIiMwMGYwZjBcIjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjdHguRmlsbFN0eWxlID0gY29sb3I7XG5cdFx0XHRcdFx0Y3R4LkZpbGxSZWN0KGNvbCAqIDYwLCByb3cgKiA2MCwgNTAsIDUwKTtcblx0XHRcdFx0fVxuXHRcdH1cblx0fVxufVxuIiwidXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XG51c2luZyBTeXN0ZW0uTGlucTtcbnVzaW5nIFN5c3RlbS5UZXh0O1xudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcblxubmFtZXNwYWNlIENvbm5lY3RGb3VyXG57XG5cdGNsYXNzIE1vdmVcblx0e1xuXHRcdHB1YmxpYyBpbnQgSW5kZXggeyBnZXQ7IHNldDsgfVxuXHR9XG5cblx0aW50ZXJmYWNlIElDb250cm9sbGVyXG5cdHtcblx0XHRUYXNrPE1vdmU+IFNlbGVjdChJRW51bWVyYWJsZTxNb3ZlPiBtb3Zlcyk7XG5cdH1cblxuXHRjbGFzcyBTb21lQ29udHJvbGxlciA6IElDb250cm9sbGVyXG5cdHtcblx0XHRwcml2YXRlIHJlYWRvbmx5IHN0cmluZyBuYW1lO1xuXG5cdFx0cHVibGljIFNvbWVDb250cm9sbGVyKHN0cmluZyBuYW1lKVxuXHRcdHtcblx0XHRcdHRoaXMubmFtZSA9IG5hbWU7XG5cdFx0fVxuXG5cdFx0VGFza0NvbXBsZXRpb25Tb3VyY2U8aW50PiBiID0gbnVsbDtcblxuXHRcdHB1YmxpYyB2b2lkIEJ1dHRvbkNsaWNrKGludCBpbmRleClcblx0XHR7XG5cdFx0XHRiIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT5iLlNldFJlc3VsdChpbmRleCkpOm51bGw7XG5cdFx0fVxuXG5cdFx0cHVibGljIGFzeW5jIFRhc2s8TW92ZT4gU2VsZWN0KElFbnVtZXJhYmxlPE1vdmU+IG1vdmVzKVxuXHRcdHtcblx0XHRcdHN0cmluZyBsaXN0ID0gc3RyaW5nLkpvaW48aW50PihcIiwgXCIsIFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2VsZWN0PE1vdmUsaW50Pihtb3ZlcywoRnVuYzxNb3ZlLGludD4pKG0gPT4gbS5JbmRleCkpKTtcblx0XHRcdE1vdmUgbWY7XG5cdFx0XHRpbnQgaW5kZXg7XG5cdFx0XHRkb1xuXHRcdFx0e1xuXHRcdFx0XHRiID0gbmV3IFRhc2tDb21wbGV0aW9uU291cmNlPGludD4oKTtcblxuXHRcdFx0XHRpbmRleCA9IGF3YWl0IGIuVGFzaztcblx0XHRcdH0gd2hpbGUgKChtZiA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2luZ2xlT3JEZWZhdWx0PE1vdmU+KG1vdmVzLChGdW5jPE1vdmUsYm9vbD4pKG0gPT4gbS5JbmRleCA9PSBpbmRleCkpKSA9PSBudWxsKTtcblxuXHRcdFx0Ly9Db25zb2xlLldyaXRlTGluZSgkXCJ7bmFtZX0gY2hvc2UgY29sdW1uIHtpbmRleCArIDF9LlwiKTtcblx0XHRcdHJldHVybiBtZjtcblx0XHR9XG5cdH1cbn1cbiJdCn0K
