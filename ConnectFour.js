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
                COLOR_CHIP_BACKGROUND: null,
                V1: 0,
                w: 0,
                V: 0
            },
            ctors: {
                init: function () {
                    this.COLOR_PLAYER_1 = "#E44A4A";
                    this.COLOR_PLAYER_2 = "#F0A30A";
                    this.COLOR_RASTER = "#FFE74D";
                    this.COLOR_CHIP_BACKGROUND = "white";
                    this.V1 = 15;
                    this.w = 60;
                    this.V = 75;
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
                    if (y > ConnectFour.Board.V1 && y < ConnectFour.Board.V) {
                        for (var col = 0; col < ConnectFour.Game.COLUMNS; col = (col + 1) | 0) {
                            if (x > ((ConnectFour.Board.V1 + Bridge.Int.mul(col, ConnectFour.Board.V)) | 0) && x < ((ConnectFour.Board.V + Bridge.Int.mul(col, ConnectFour.Board.V)) | 0)) {
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
                this.imageController1.src = "mouse.png";

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



                                        this.canvas.width = (Bridge.Int.mul(System.Array.getLength(game.Chips, 1), ConnectFour.Board.V) + ConnectFour.Board.V1) | 0;
                                        this.canvas.height = (Bridge.Int.mul((((System.Array.getLength(game.Chips, 0) + 1) | 0)), ConnectFour.Board.V) + ConnectFour.Board.V1) | 0;

                                        ctx.fillStyle = ConnectFour.Board.COLOR_RASTER;
                                        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                                        for (var col = 0; col < System.Array.getLength(game.Chips, 1); col = (col + 1) | 0) {
                                            ctx.fillStyle = game.CurrentChip === ConnectFour.Game.Chip.Mouse ? ConnectFour.Board.COLOR_PLAYER_1 : ConnectFour.Board.COLOR_PLAYER_2;
                                            ctx.fillRect(((ConnectFour.Board.V1 + Bridge.Int.mul(col, ConnectFour.Board.V)) | 0), ConnectFour.Board.V1, ConnectFour.Board.w, ConnectFour.Board.w);
                                        }

                                        for (var row = 0; row < System.Array.getLength(game.Chips, 0); row = (row + 1) | 0) {
                                            for (var col1 = 0; col1 < System.Array.getLength(game.Chips, 1); col1 = (col1 + 1) | 0) {
                                                if (System.Nullable.eq(game.Chips.get([row, col1]), ConnectFour.Game.Chip.Mouse)) {
                                                    ctx.drawImage(this.imageController1, ((ConnectFour.Board.V1 + Bridge.Int.mul(col1, ConnectFour.Board.V)) | 0), ((ConnectFour.Board.V1 + Bridge.Int.mul((((row + 1) | 0)), ConnectFour.Board.V)) | 0), 60.0, 60.0);
                                                } else if (System.Nullable.eq(game.Chips.get([row, col1]), ConnectFour.Game.Chip.Cat)) {
                                                    ctx.drawImage(this.imageController2, ((ConnectFour.Board.V1 + Bridge.Int.mul(col1, ConnectFour.Board.V)) | 0), ((ConnectFour.Board.V1 + Bridge.Int.mul((((row + 1) | 0)), ConnectFour.Board.V)) | 0), 60.0, 60.0);
                                                } else {
                                                    ctx.beginPath();
                                                    ctx.fillStyle = ConnectFour.Board.COLOR_CHIP_BACKGROUND;
                                                    ctx.ellipse(((45 + Bridge.Int.mul(col1, ConnectFour.Board.V)) | 0), ((45 + Bridge.Int.mul((((row + 1) | 0)), ConnectFour.Board.V)) | 0), 30, 30, 0, 0, 6.2831853071795862);
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

    Bridge.define("ConnectFour.IController", {
        $kind: "interface"
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
            },
            methods: {
                GetPossibleMoves: function (chips) {
                    return new (Bridge.GeneratorEnumerable$1(System.Int32))(Bridge.fn.bind(this, function (chips) {
                        var $step = 0,
                            $jumpFromFinally,
                            $returnValue,
                            i,
                            $async_e;

                        var $enumerator = new (Bridge.GeneratorEnumerator$1(System.Int32))(Bridge.fn.bind(this, function () {
                            try {
                                for (;;) {
                                    switch ($step) {
                                        case 0: {
                                            i = 0;
                                                $step = 1;
                                                continue;
                                        }
                                        case 1: {
                                            if ( i < ConnectFour.Game.COLUMNS ) {
                                                    $step = 2;
                                                    continue;
                                                }
                                            $step = 7;
                                            continue;
                                        }
                                        case 2: {
                                            if (!System.Nullable.hasValue(chips.get([0, i]))) {
                                                    $step = 3;
                                                    continue;
                                                } 
                                                $step = 5;
                                                continue;
                                        }
                                        case 3: {
                                            $enumerator.current = i;
                                                $step = 4;
                                                return true;
                                        }
                                        case 4: {
                                            $step = 5;
                                            continue;
                                        }
                                        case 5: {
                                            $step = 6;
                                            continue;
                                        }
                                        case 6: {
                                            i = (i + 1) | 0;
                                            $step = 1;
                                            continue;
                                        }
                                        case 7: {

                                        }
                                        default: {
                                            return false;
                                        }
                                    }
                                }
                            } catch($async_e1) {
                                $async_e = System.Exception.create($async_e1);
                                throw $async_e;
                            }
                        }));
                        return $enumerator;
                    }, arguments));
                },
                MoveAndCheckForWin: function (chips, currentChip, win, columnIndex) {
                    var i;
                    for (i = 0; i < ConnectFour.Game.ROWS; i = (i + 1) | 0) {
                        if (System.Nullable.hasValue(chips.get([i, columnIndex]))) {
                            break;
                        }
                    }
                    chips.set([((i - 1) | 0), columnIndex], currentChip);
                    var row = (i - 1) | 0;
                    var col = columnIndex;

                    return ConnectFour.Game.CheckAxis(chips, currentChip, win, row, col, 0, 1) || ConnectFour.Game.CheckAxis(chips, currentChip, win, row, col, 1, 0) || ConnectFour.Game.CheckAxis(chips, currentChip, win, row, col, 1, 1) || ConnectFour.Game.CheckAxis(chips, currentChip, win, row, col, 1, -1);
                },
                CheckAxis: function (chips, currentChip, win, row, col, drow, dcol) {
                    var CheckOneSide = null;
                    CheckOneSide = function (drow2, dcol2) {
                        var c = 0;
                        for (var i = 1; i < win; i = (i + 1) | 0) {
                            if (((col + Bridge.Int.mul(i, dcol2)) | 0) >= 0 && ((col + Bridge.Int.mul(i, dcol2)) | 0) < ConnectFour.Game.COLUMNS && ((row + Bridge.Int.mul(i, drow2)) | 0) >= 0 && ((row + Bridge.Int.mul(i, drow2)) | 0) < ConnectFour.Game.ROWS && System.Nullable.eq(chips.get([((row + Bridge.Int.mul(i, drow2)) | 0), ((col + Bridge.Int.mul(i, dcol2)) | 0)]), currentChip)) {
                                c = (c + 1) | 0;
                            } else {
                                break;
                            }
                        }
                        return c;
                    };
                    return ((((CheckOneSide(drow, dcol) + CheckOneSide(((-drow) | 0), ((-dcol) | 0))) | 0) + 1) | 0) >= win;


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

                                        moves = System.Linq.Enumerable.from(ConnectFour.Game.GetPossibleMoves(this.Chips)).select(function (i) {
                                            return new ConnectFour.Game.Move(i);
                                        }).toList(ConnectFour.Game.Move);

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

                                        if (ConnectFour.Game.MoveAndCheckForWin(this.Chips, this.CurrentChip, ConnectFour.Game.WIN, selectedMove.ColumnIndex)) {
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
                    this.Info = "1.0.14";
                }
            }
        }
    });

    Bridge.define("ConnectFour.ComputerController", {
        inherits: [ConnectFour.IController],
        alias: ["Select", "ConnectFour$IController$Select"],
        methods: {
            Select: function (game, allowedMoves) {
                var $t, $t1, $t2, $t3, $t4;
                var otherChip = game.CurrentChip === ConnectFour.Game.Chip.Cat ? ConnectFour.Game.Chip.Mouse : ConnectFour.Game.Chip.Cat;
                var okMoves = new (System.Collections.Generic.List$1(ConnectFour.Game.Move)).ctor();

                $t = Bridge.getEnumerator(allowedMoves, ConnectFour.Game.Move);
                try {
                    while ($t.moveNext()) {
                        var allowedMove = $t.Current;
                        var chipsCopy = Bridge.cast(System.Array.clone(game.Chips), System.Array.type(System.Nullable$1(ConnectFour.Game.Chip), 2));
                        if (ConnectFour.Game.MoveAndCheckForWin(chipsCopy, game.CurrentChip, ConnectFour.Game.WIN, allowedMove.ColumnIndex)) {
                            System.Console.WriteLine("Winning move!");
                            return System.Threading.Tasks.Task.fromResult(allowedMove, ConnectFour.Game.Move);
                        } else {
                            var okMove = true;

                            $t1 = Bridge.getEnumerator(ConnectFour.Game.GetPossibleMoves(chipsCopy), System.Int32);
                            try {
                                while ($t1.moveNext()) {
                                    var colIndex = $t1.Current;
                                    var chipsCopy2 = Bridge.cast(System.Array.clone(chipsCopy), System.Array.type(System.Nullable$1(ConnectFour.Game.Chip), 2));
                                    if (ConnectFour.Game.MoveAndCheckForWin(chipsCopy2, otherChip, ConnectFour.Game.WIN, colIndex)) {
                                        okMove = false;
                                    }
                                }
                            } finally {
                                if (Bridge.is($t1, System.IDisposable)) {
                                    $t1.System$IDisposable$Dispose();
                                }
                            }

                            if (okMove) {
                                okMoves.add(allowedMove);
                            }
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

                $t2 = Bridge.getEnumerator(allowedMoves, ConnectFour.Game.Move);
                try {
                    while ($t2.moveNext()) {
                        var allowedMove1 = $t2.Current;
                        var chipsCopy1 = Bridge.cast(System.Array.clone(game.Chips), System.Array.type(System.Nullable$1(ConnectFour.Game.Chip), 2));
                        if (ConnectFour.Game.MoveAndCheckForWin(chipsCopy1, otherChip, ConnectFour.Game.WIN, allowedMove1.ColumnIndex)) {
                            System.Console.WriteLine("Preventing winning move!");
                            return System.Threading.Tasks.Task.fromResult(allowedMove1, ConnectFour.Game.Move);
                        }
                    }
                } finally {
                    if (Bridge.is($t2, System.IDisposable)) {
                        $t2.System$IDisposable$Dispose();
                    }
                }

                $t3 = Bridge.getEnumerator(okMoves);
                try {
                    while ($t3.moveNext()) {
                        var okMove1 = $t3.Current;
                        var chipsCopy3 = Bridge.cast(System.Array.clone(game.Chips), System.Array.type(System.Nullable$1(ConnectFour.Game.Chip), 2));
                        if (ConnectFour.Game.MoveAndCheckForWin(chipsCopy3, otherChip, 3, okMove1.ColumnIndex)) {
                            System.Console.WriteLine("I think I'm being clever!");
                            return System.Threading.Tasks.Task.fromResult(okMove1, ConnectFour.Game.Move);
                        }
                    }
                } finally {
                    if (Bridge.is($t3, System.IDisposable)) {
                        $t3.System$IDisposable$Dispose();
                    }
                }

                $t4 = Bridge.getEnumerator(okMoves);
                try {
                    while ($t4.moveNext()) {
                        var okMove2 = $t4.Current;
                        var chipsCopy4 = Bridge.cast(System.Array.clone(game.Chips), System.Array.type(System.Nullable$1(ConnectFour.Game.Chip), 2));
                        if (ConnectFour.Game.MoveAndCheckForWin(chipsCopy4, game.CurrentChip, 3, okMove2.ColumnIndex)) {
                            System.Console.WriteLine("Haha, I have three in a row!");
                            return System.Threading.Tasks.Task.fromResult(okMove2, ConnectFour.Game.Move);
                        }
                    }
                } finally {
                    if (Bridge.is($t4, System.IDisposable)) {
                        $t4.System$IDisposable$Dispose();
                    }
                }

                var rand = new System.Random.ctor();
                if (System.Linq.Enumerable.from(okMoves).count() > 0) {
                    var index = rand.Next$2(0, System.Linq.Enumerable.from(okMoves).count());
                    System.Console.WriteLine("Don't know, picking random...");
                    return System.Threading.Tasks.Task.fromResult(System.Linq.Enumerable.from(okMoves).elementAt(index), ConnectFour.Game.Move);
                } else {
                    var index1 = rand.Next$2(0, System.Linq.Enumerable.from(allowedMoves).count());
                    System.Console.WriteLine("Don't have a good feeling, but no clue, picking random...");
                    return System.Threading.Tasks.Task.fromResult(System.Linq.Enumerable.from(allowedMoves).elementAt(index1), ConnectFour.Game.Move);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJDb25uZWN0Rm91ci5qcyIsCiAgInNvdXJjZVJvb3QiOiAiIiwKICAic291cmNlcyI6IFsiQm9hcmQuY3MiLCJHYW1lLmNzIiwiUHJvZ3JhbS5jcyIsIkNvbXB1dGVyQ29udHJvbGxlci5jcyIsIkh1bWFuQ29udHJvbGxlci5jcyJdLAogICJuYW1lcyI6IFsiIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OENBb0JzRUEsSUFBSUE7OENBQ0pBLElBQUlBOzs7O2dCQWN2RUEsY0FBU0E7O2dCQUVUQSw2QkFBd0JBO2dCQUN4QkE7Z0JBQ0FBO2dCQUNBQTtnQkFDQUEsc0JBQWlCQSwrQkFBQ0E7b0JBRWpCQSxRQUFRQSxZQUFVQSwrQkFBb0JBLE1BQU1BO29CQUM1Q0EsUUFBUUEsWUFBVUEsOEJBQW1CQSxNQUFNQTs7b0JBRTNDQSx5QkFBa0JBLHVDQUErQkEsK0VBQUVBO29CQUNuREEsSUFBSUEsSUFBSUEsd0JBQU1BLElBQUlBO3dCQUVqQkEsS0FBS0EsYUFBYUEsTUFBTUEsMEJBQWNBOzRCQUVyQ0EsSUFBSUEsSUFBSUEseUJBQUtBLG9CQUFNQSw4QkFBS0EsSUFBSUEsd0JBQUlBLG9CQUFNQTtnQ0FFckNBLDBDQUFnQkEsUUFBS0EsQUFBcUNBLG9CQUFzQkEsT0FBTUE7Ozs7OztnQkFNMUZBLFlBQU9BOztnQkFFUEEsd0JBQW1CQTtnQkFDbkJBLCtCQUEwQkEsK0JBQUNBO29CQUFNQTs7Z0JBQ2pDQTs7Z0JBRUFBLHdCQUFtQkE7Z0JBQ25CQSwrQkFBMEJBLCtCQUFDQTtvQkFBTUE7O2dCQUNqQ0E7Ozs7NkJBR3VCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7d0NBRXZCQSxTQUFNQTs7Ozs7Ozt3Q0FDTkEsU0FBTUE7Ozs7Ozs7d0NBRU5BLE1BQVVBLEFBQTBCQTs7Ozt3Q0FJcENBLG9CQUFlQSx1REFBMEJBLHVCQUFJQTt3Q0FDN0NBLHFCQUFnQkEsaUJBQUNBLG9EQUErQkEsdUJBQUlBOzt3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QSwyQkFBdUJBOzs7O3dCQUV0QkEsaUJBQTBCQSxZQUFlQTt3QkFDekNBLElBQUlBLG9DQUF3QkEsWUFBV0EsV0FBV0EsR0FBY0E7NEJBRS9EQTs0QkFDQUEsT0FBT0EsdUNBQTJCQSxTQUFYQTs7Ozs7Ozs7O2dCQUt6QkEsMkJBQXVCQTs7Ozt3QkFFdEJBLGlCQUEwQkEsWUFBZUE7d0JBQ3pDQSxJQUFJQSxvQ0FBd0JBLFlBQVdBLGtCQUFrQkEsR0FBY0E7NEJBRXRFQTs0QkFDQUEsT0FBT0EsdUNBQTJCQSxTQUFYQTs7Ozs7Ozs7O2dCQUl6QkEsV0FBY0EsSUFBSUE7Z0JBQ2xCQSxJQUFJQSw0QkFBd0NBO29CQUUzQ0EsWUFBWUEsZUFBYUEsNEJBQXdDQTtvQkFDakVBO29CQUNBQSxPQUFPQSx1Q0FBMkJBLDRCQUE0Q0EsbUJBQVFBLFFBQS9EQTs7b0JBSXZCQSxhQUFZQSxlQUFhQSw0QkFBd0NBO29CQUNqRUE7b0JBQ0FBLE9BQU9BLHVDQUEyQkEsNEJBQTRDQSx3QkFBYUEsU0FBcEVBOzs7Ozs7Ozs7Ozs7OzRCQy9FRkE7O2dCQUV0QkEsYUFBYUE7Ozs7OEJBR3NCQSxNQUFXQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O3dDQUU5Q0EsdUJBQWlEQTs7d0NBRWpEQSx3QkFBbURBLFVBQUNBOzRDQUFvQkEsK0JBQStCQTs7O3dDQUV2R0EsNkJBQXdCQTs7d0NBR3hCQTs7O3dDQUVDQSx1QkFBdUJBLElBQUlBO3dDQUMzQkEsU0FBZ0NBOzs7Ozs7O29FQUFOQTt3Q0FDMUJBLGVBQWVBLDRCQUFrREEsOEJBQWFBLEFBQThCQTs7dURBQVFBLHFCQUFvQkE7Ozs7Ozs7NkNBQ2hJQSxnQkFBZ0JBOzs7Ozs7Ozs7d0NBRXpCQSxnQ0FBd0JBOzt3Q0FFeEJBLGVBQU9BIiwKICAic291cmNlc0NvbnRlbnQiOiBbInVzaW5nIEJyaWRnZS5IdG1sNTtcbnVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XG5cbm5hbWVzcGFjZSBDb25uZWN0Rm91clxue1xuXHRkZWxlZ2F0ZSB2b2lkIENvbHVtblNlbGVjdGVkRXZlbnRIYW5kbGVyKGludCBjb2x1bW5JbmRleCk7XG5cblx0ZGVsZWdhdGUgdm9pZCBDb2xvckNoYW5nZWRFdmVudEhhbmRsZXIoc3RyaW5nIGNvbG9yKTtcblxuXHRjbGFzcyBCb2FyZFxuXHR7XG5cdFx0cHJpdmF0ZSBjb25zdCBzdHJpbmcgQ09MT1JfUExBWUVSXzEgPSBcIiNFNDRBNEFcIjtcblx0XHRwcml2YXRlIGNvbnN0IHN0cmluZyBDT0xPUl9QTEFZRVJfMiA9IFwiI0YwQTMwQVwiO1xuXHRcdHByaXZhdGUgY29uc3Qgc3RyaW5nIENPTE9SX1JBU1RFUiA9IFwiI0ZGRTc0RFwiO1xuXHRcdHByaXZhdGUgY29uc3Qgc3RyaW5nIENPTE9SX0NISVBfQkFDS0dST1VORCA9IFwid2hpdGVcIjtcblxuXHRcdHByaXZhdGUgcmVhZG9ubHkgSFRNTENhbnZhc0VsZW1lbnQgY2FudmFzO1xuXHRcdHByaXZhdGUgcmVhZG9ubHkgSFRNTEltYWdlRWxlbWVudCBpbWFnZUNvbnRyb2xsZXIxO1xuXHRcdHByaXZhdGUgcmVhZG9ubHkgSFRNTEltYWdlRWxlbWVudCBpbWFnZUNvbnRyb2xsZXIyO1xuXHRcdHByaXZhdGUgcmVhZG9ubHkgVGFza0NvbXBsZXRpb25Tb3VyY2U8aW50PiBsb2FkZWRJbWFnZUNvbnRyb2xsZXIxID0gbmV3IFRhc2tDb21wbGV0aW9uU291cmNlPGludD4oKTtcblx0XHRwcml2YXRlIHJlYWRvbmx5IFRhc2tDb21wbGV0aW9uU291cmNlPGludD4gbG9hZGVkSW1hZ2VDb250cm9sbGVyMiA9IG5ldyBUYXNrQ29tcGxldGlvblNvdXJjZTxpbnQ+KCk7XG5cblx0XHRwdWJsaWMgZXZlbnQgQ29sdW1uU2VsZWN0ZWRFdmVudEhhbmRsZXIgQ29sdW1uU2VsZWN0ZWQ7XG5cblx0XHRwdWJsaWMgTm9kZSBSb290IHsgZ2V0OyBwcml2YXRlIHNldDsgfVxuXG5cblxuXHRcdGNvbnN0IGludCBWMSA9IDE1O1xuXHRcdGNvbnN0IGludCB3ID0gNjA7XG5cdFx0Y29uc3QgaW50IFYgPSA3NTtcblxuXHRcdHB1YmxpYyBCb2FyZCgpXG5cdFx0e1xuXHRcdFx0Y2FudmFzID0gbmV3IEhUTUxDYW52YXNFbGVtZW50KCk7XG5cblx0XHRcdGNhbnZhcy5TdHlsZS5Qb3NpdGlvbiA9IFBvc2l0aW9uLkFic29sdXRlO1xuXHRcdFx0Y2FudmFzLlN0eWxlLlRvcCA9IFwiNTAlXCI7XG5cdFx0XHRjYW52YXMuU3R5bGUuTGVmdCA9IFwiNTAlXCI7XG5cdFx0XHRjYW52YXMuU3R5bGUuVHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUoLTUwJSwgLTUwJSlcIjtcblx0XHRcdGNhbnZhcy5PbkNsaWNrID0gKGUpID0+XG5cdFx0XHR7XG5cdFx0XHRcdHZhciB4ID0gZS5QYWdlWCAtIGNhbnZhcy5PZmZzZXRMZWZ0ICsgMC41ICogY2FudmFzLldpZHRoO1xuXHRcdFx0XHR2YXIgeSA9IGUuUGFnZVkgLSBjYW52YXMuT2Zmc2V0VG9wICsgMC41ICogY2FudmFzLkhlaWdodDtcblxuXHRcdFx0XHRDb25zb2xlLldyaXRlTGluZShzdHJpbmcuRm9ybWF0KFwiWDogezB9LCBZOiB7MX1cIix4LHkpKTtcblx0XHRcdFx0aWYgKHkgPiBWMSAmJiB5IDwgVilcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGZvciAoaW50IGNvbCA9IDA7IGNvbCA8IEdhbWUuQ09MVU1OUzsgY29sKyspXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0aWYgKHggPiBWMSArIGNvbCAqIFYgJiYgeCA8IFYgKyBjb2wgKiBWKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRDb2x1bW5TZWxlY3RlZCE9bnVsbD9nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbUxhbWJkYSgoKT0+Q29sdW1uU2VsZWN0ZWQuSW52b2tlKGNvbCkpOm51bGw7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRSb290ID0gY2FudmFzO1xuXG5cdFx0XHRpbWFnZUNvbnRyb2xsZXIxID0gbmV3IEhUTUxJbWFnZUVsZW1lbnQoKTtcblx0XHRcdGltYWdlQ29udHJvbGxlcjEuT25Mb2FkID0gKF8pID0+IGxvYWRlZEltYWdlQ29udHJvbGxlcjEuU2V0UmVzdWx0KDApO1xuXHRcdFx0aW1hZ2VDb250cm9sbGVyMS5TcmMgPSBcIm1vdXNlLnBuZ1wiO1xuXG5cdFx0XHRpbWFnZUNvbnRyb2xsZXIyID0gbmV3IEhUTUxJbWFnZUVsZW1lbnQoKTtcblx0XHRcdGltYWdlQ29udHJvbGxlcjIuT25Mb2FkID0gKF8pID0+IGxvYWRlZEltYWdlQ29udHJvbGxlcjIuU2V0UmVzdWx0KDApO1xuXHRcdFx0aW1hZ2VDb250cm9sbGVyMi5TcmMgPSBcImNoaXAyLnN2Z1wiO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBhc3luYyBUYXNrIFBhaW50KEdhbWUgZ2FtZSlcblx0XHR7XG5cdFx0XHRhd2FpdCBsb2FkZWRJbWFnZUNvbnRyb2xsZXIxLlRhc2s7XG5cdFx0XHRhd2FpdCBsb2FkZWRJbWFnZUNvbnRyb2xsZXIyLlRhc2s7XG5cblx0XHRcdHZhciBjdHggPSAoQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKWNhbnZhcy5HZXRDb250ZXh0KFwiMmRcIik7XG5cblxuXG5cdFx0XHRjYW52YXMuV2lkdGggPSBnYW1lLkNoaXBzLkdldExlbmd0aCgxKSAqIFYgKyBWMTtcblx0XHRcdGNhbnZhcy5IZWlnaHQgPSAoZ2FtZS5DaGlwcy5HZXRMZW5ndGgoMCkgKyAxKSAqIFYgKyBWMTtcblxuXHRcdFx0Y3R4LkZpbGxTdHlsZSA9IENPTE9SX1JBU1RFUjtcblx0XHRcdGN0eC5GaWxsUmVjdCgwLCAwLCBjYW52YXMuV2lkdGgsIGNhbnZhcy5IZWlnaHQpO1xuXG5cdFx0XHRmb3IgKGludCBjb2wgPSAwOyBjb2wgPCBnYW1lLkNoaXBzLkdldExlbmd0aCgxKTsgY29sKyspXG5cdFx0XHR7XG5cdFx0XHRcdGN0eC5GaWxsU3R5bGUgPSBnYW1lLkN1cnJlbnRDaGlwID09IEdhbWUuQ2hpcC5Nb3VzZSA/IENPTE9SX1BMQVlFUl8xIDogQ09MT1JfUExBWUVSXzI7XG5cdFx0XHRcdGN0eC5GaWxsUmVjdChWMSArIGNvbCAqIFYsIFYxLCB3LCB3KTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yIChpbnQgcm93ID0gMDsgcm93IDwgZ2FtZS5DaGlwcy5HZXRMZW5ndGgoMCk7IHJvdysrKVxuXHRcdFx0e1xuXHRcdFx0XHRmb3IgKGludCBjb2wgPSAwOyBjb2wgPCBnYW1lLkNoaXBzLkdldExlbmd0aCgxKTsgY29sKyspXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZiAoZ2FtZS5DaGlwc1tyb3csIGNvbF0gPT0gR2FtZS5DaGlwLk1vdXNlKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGN0eC5EcmF3SW1hZ2UoaW1hZ2VDb250cm9sbGVyMSwgVjEgKyBjb2wgKiBWLCBWMSArIChyb3cgKyAxKSAqIFYsIHcgKiAxZCwgdyAqIDFkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAoZ2FtZS5DaGlwc1tyb3csIGNvbF0gPT0gR2FtZS5DaGlwLkNhdClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjdHguRHJhd0ltYWdlKGltYWdlQ29udHJvbGxlcjIsIFYxICsgY29sICogViwgVjEgKyAocm93ICsgMSkgKiBWLCB3ICogMWQsIHcgKiAxZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRjdHguQmVnaW5QYXRoKCk7XG5cdFx0XHRcdFx0XHRjdHguRmlsbFN0eWxlID0gQ09MT1JfQ0hJUF9CQUNLR1JPVU5EO1xuXHRcdFx0XHRcdFx0Y3R4LkVsbGlwc2UoVjEgKyB3IC8gMiArIGNvbCAqIFYsIFYxICsgdyAvIDIgKyAocm93ICsgMSkgKiBWLCB3IC8gMiwgdyAvIDIsIDAsIDAsIDIgKiBNYXRoLlBJKTtcblx0XHRcdFx0XHRcdGN0eC5GaWxsKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG4iLCJ1c2luZyBCcmlkZ2UuSHRtbDU7XG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcbnVzaW5nIFN5c3RlbS5MaW5xO1xudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcblxubmFtZXNwYWNlIENvbm5lY3RGb3VyXG57XG5cdGRlbGVnYXRlIHZvaWQgR2FtZVVwZGF0ZWRFdmVudEhhbmRsZXIoR2FtZSBnYW1lKTtcblxuXHRjbGFzcyBHYW1lXG5cdHtcblx0XHRwdWJsaWMgY29uc3QgaW50IFJPV1MgPSA2O1xuXHRcdHB1YmxpYyBjb25zdCBpbnQgQ09MVU1OUyA9IDc7XG5cdFx0cHVibGljIGNvbnN0IGludCBXSU4gPSA0O1xuXG5cdFx0cHVibGljIGV2ZW50IEdhbWVVcGRhdGVkRXZlbnRIYW5kbGVyIEdhbWVVcGRhdGVkO1xuXG5cdFx0cHVibGljIGVudW0gQ2hpcFxuXHRcdHtcblx0XHRcdE1vdXNlLFxuXHRcdFx0Q2F0XG5cdFx0fVxuXG5cdFx0cHVibGljIENoaXAgQ3VycmVudENoaXAgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XHJcblxuXG5cdFx0cHVibGljIENoaXA/WyxdIENoaXBzIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxyXG5cblxuXHRcdHB1YmxpYyBJQ29udHJvbGxlciBDb250cm9sbGVyMSB7IGdldDsgc2V0OyB9XG5cblx0XHRwdWJsaWMgSUNvbnRyb2xsZXIgQ29udHJvbGxlcjIgeyBnZXQ7IHNldDsgfVxuXG5cdFx0cHVibGljIGFzeW5jIFRhc2sgUnVuKClcblx0XHR7XG5cdFx0XHR3aGlsZSAodHJ1ZSlcblx0XHRcdHtcblx0XHRcdFx0R2FtZVVwZGF0ZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PkdhbWVVcGRhdGVkLkludm9rZSh0aGlzKSk6bnVsbDtcblxuXHRcdFx0XHRMaXN0PE1vdmU+IG1vdmVzID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3Q8aW50LEdhbWUuTW92ZT4oR2V0UG9zc2libGVNb3ZlcyhDaGlwcyksKFN5c3RlbS5GdW5jPGludCxHYW1lLk1vdmU+KShpID0+IG5ldyBNb3ZlKGkpKSkuVG9MaXN0KCk7XG5cblx0XHRcdFx0TW92ZSBzZWxlY3RlZE1vdmUgPSAoQ3VycmVudENoaXAgPT0gQ2hpcC5Nb3VzZSA/IGF3YWl0IENvbnRyb2xsZXIxLlNlbGVjdCh0aGlzLCBtb3ZlcykgOiBhd2FpdCBDb250cm9sbGVyMi5TZWxlY3QodGhpcywgbW92ZXMpKTtcblxuXHRcdFx0XHRpZiAoTW92ZUFuZENoZWNrRm9yV2luKENoaXBzLCBDdXJyZW50Q2hpcCwgV0lOLCBzZWxlY3RlZE1vdmUuQ29sdW1uSW5kZXgpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0R2FtZVVwZGF0ZWQhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9PkdhbWVVcGRhdGVkLkludm9rZSh0aGlzKSk6bnVsbDtcblx0XHRcdFx0XHRXaW5kb3cuU2V0VGltZW91dCgoU3lzdGVtLkFjdGlvbikoKCkgPT5cblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRXaW5kb3cuQWxlcnQoc3RyaW5nLkZvcm1hdChcInswfSB3aW5zIVwiLEN1cnJlbnRDaGlwKSk7XG5cdFx0XHRcdFx0fSkpO1xuXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRDdXJyZW50Q2hpcCA9IChDdXJyZW50Q2hpcCA9PSBDaGlwLk1vdXNlID8gQ2hpcC5DYXQgOiBDaGlwLk1vdXNlKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRwdWJsaWMgc3RhdGljIElFbnVtZXJhYmxlPGludD4gR2V0UG9zc2libGVNb3ZlcyhDaGlwP1ssXSBjaGlwcylcblx0XHR7XG5cdFx0XHRmb3IgKGludCBpID0gMDsgaSA8IENPTFVNTlM7IGkrKylcblx0XHRcdHtcblx0XHRcdFx0aWYgKCFjaGlwc1swLCBpXS5IYXNWYWx1ZSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHlpZWxkIHJldHVybiBpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cHVibGljIHN0YXRpYyBib29sIE1vdmVBbmRDaGVja0ZvcldpbihDaGlwP1ssXSBjaGlwcywgQ2hpcCBjdXJyZW50Q2hpcCwgaW50IHdpbiwgaW50IGNvbHVtbkluZGV4KVxuXHRcdHtcblx0XHRcdGludCBpO1xuXHRcdFx0Zm9yIChpID0gMDsgaSA8IFJPV1M7IGkrKylcblx0XHRcdFx0aWYgKGNoaXBzW2ksIGNvbHVtbkluZGV4XS5IYXNWYWx1ZSlcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdGNoaXBzW2kgLSAxLCBjb2x1bW5JbmRleF0gPSBjdXJyZW50Q2hpcDtcblx0XHRcdGludCByb3cgPSBpIC0gMTtcblx0XHRcdGludCBjb2wgPSBjb2x1bW5JbmRleDtcblxuXHRcdFx0cmV0dXJuIENoZWNrQXhpcyhjaGlwcywgY3VycmVudENoaXAsIHdpbiwgcm93LCBjb2wsIDAsIDEpXG5cdFx0XHRcdHx8IENoZWNrQXhpcyhjaGlwcywgY3VycmVudENoaXAsIHdpbiwgcm93LCBjb2wsIDEsIDApXG5cdFx0XHRcdHx8IENoZWNrQXhpcyhjaGlwcywgY3VycmVudENoaXAsIHdpbiwgcm93LCBjb2wsIDEsIDEpXG5cdFx0XHRcdHx8IENoZWNrQXhpcyhjaGlwcywgY3VycmVudENoaXAsIHdpbiwgcm93LCBjb2wsIDEsIC0xKTtcblx0XHR9XG5cblx0XHRwcml2YXRlIHN0YXRpYyBib29sIENoZWNrQXhpcyhDaGlwP1ssXSBjaGlwcywgQ2hpcCBjdXJyZW50Q2hpcCwgaW50IHdpbiwgaW50IHJvdywgaW50IGNvbCwgaW50IGRyb3csIGludCBkY29sKVxuXHRcdHtcblN5c3RlbS5GdW5jPGludCwgaW50LCBpbnQ+IENoZWNrT25lU2lkZSA9IG51bGw7XG5DaGVja09uZVNpZGUgPSAoZHJvdzIsIGRjb2wyKSA9PlxyXG57XHJcbiAgICBpbnQgYyA9IDA7XHJcbiAgICBmb3IgKGludCBpID0gMTsgaSA8IHdpbjsgaSsrKVxyXG4gICAgICAgIGlmIChjb2wgKyBpICogZGNvbDIgPj0gMCAmJiBjb2wgKyBpICogZGNvbDIgPCBDT0xVTU5TICYmIHJvdyArIGkgKiBkcm93MiA+PSAwICYmIHJvdyArIGkgKiBkcm93MiA8IFJPV1MgJiYgY2hpcHNbcm93ICsgaSAqIGRyb3cyLCBjb2wgKyBpICogZGNvbDJdID09IGN1cnJlbnRDaGlwKVxyXG4gICAgICAgICAgICBjKys7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIHJldHVybiBjO1xyXG59XHJcblxyXG47XG5cdFx0XHRyZXR1cm4gQ2hlY2tPbmVTaWRlKGRyb3csIGRjb2wpICsgQ2hlY2tPbmVTaWRlKC1kcm93LCAtZGNvbCkgKyAxID49IHdpbjtcblxuXHRcdFx0XG5cdFx0fVxuXG5cdFx0cHVibGljIGNsYXNzIE1vdmVcblx0XHR7XG5cdFx0XHRwdWJsaWMgaW50IENvbHVtbkluZGV4IHsgZ2V0OyBwcml2YXRlIHNldDsgfVxuXG5cdFx0XHRwdWJsaWMgTW92ZShpbnQgY29sdW1uSW5kZXgpXG5cdFx0XHR7XG5cdFx0XHRcdENvbHVtbkluZGV4ID0gY29sdW1uSW5kZXg7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFxucHJpdmF0ZSBDaGlwIF9fUHJvcGVydHlfX0luaXRpYWxpemVyX19DdXJyZW50Q2hpcD1DaGlwLk1vdXNlO3ByaXZhdGUgQ2hpcD9bLF0gX19Qcm9wZXJ0eV9fSW5pdGlhbGl6ZXJfX0NoaXBzPW5ldyBDaGlwP1tST1dTLCBDT0xVTU5TXTt9XG59XG4iLCJ1c2luZyBCcmlkZ2UuSHRtbDU7XG51c2luZyBTeXN0ZW07XG5cbm5hbWVzcGFjZSBDb25uZWN0Rm91clxue1xuXHRwdWJsaWMgY2xhc3MgUHJvZ3JhbVxuXHR7XG5cdFx0cHVibGljIHN0YXRpYyB2b2lkIE1haW4oKVxuXHRcdHtcblx0XHRcdENvbnNvbGUuV3JpdGVMaW5lKHN0cmluZy5Gb3JtYXQoXCJWZXJzaW9uOiB7MH1cIixWZXJzaW9uLkluZm8pKTtcblxuXHRcdFx0Qm9hcmQgYm9hcmQgPSBuZXcgQm9hcmQoKTtcblx0XHRcdERvY3VtZW50LkJvZHkuQXBwZW5kQ2hpbGQoYm9hcmQuUm9vdCk7XG5cdFx0XHREb2N1bWVudC5Cb2R5LlN0eWxlLkJhY2tncm91bmRJbWFnZSA9IFwidXJsKCdiYWNrZ3JvdW5kLnBuZycpXCI7XG5cblx0XHRcdEdhbWUgZ2FtZSA9IG5ldyBHYW1lXG5cdFx0XHR7XG5cdFx0XHRcdENvbnRyb2xsZXIxID0gbmV3IEh1bWFuQ29udHJvbGxlcihib2FyZCksXG5cdFx0XHRcdENvbnRyb2xsZXIyID0gbmV3IEh1bWFuQ29udHJvbGxlcihib2FyZClcblx0XHRcdH07XG5cblx0XHRcdGdhbWUuR2FtZVVwZGF0ZWQgKz0gYXN5bmMgKGcpID0+IGF3YWl0IGJvYXJkLlBhaW50KGcpO1xuQnJpZGdlLlNjcmlwdC5EaXNjYXJkPSBnYW1lLlJ1bigpO1xuXHRcdH1cblx0fVxufVxuIiwidXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XG51c2luZyBTeXN0ZW0uTGlucTtcbnVzaW5nIFN5c3RlbS5UaHJlYWRpbmcuVGFza3M7XG5cbm5hbWVzcGFjZSBDb25uZWN0Rm91clxue1xuXHRjbGFzcyBDb21wdXRlckNvbnRyb2xsZXIgOiBJQ29udHJvbGxlclxuXHR7XG5cdFx0cHVibGljIFRhc2s8R2FtZS5Nb3ZlPiBTZWxlY3QoR2FtZSBnYW1lLCBJRW51bWVyYWJsZTxHYW1lLk1vdmU+IGFsbG93ZWRNb3Zlcylcblx0XHR7XG5cdFx0XHRHYW1lLkNoaXAgb3RoZXJDaGlwID0gZ2FtZS5DdXJyZW50Q2hpcCA9PSBHYW1lLkNoaXAuQ2F0ID8gR2FtZS5DaGlwLk1vdXNlIDogR2FtZS5DaGlwLkNhdDtcblx0XHRcdExpc3Q8R2FtZS5Nb3ZlPiBva01vdmVzID0gbmV3IExpc3Q8R2FtZS5Nb3ZlPigpO1xuXG5cdFx0XHQvLyBDaGVjayBpZiBJIGNhbiB3aW4/XG5cdFx0XHRmb3JlYWNoICh2YXIgYWxsb3dlZE1vdmUgaW4gYWxsb3dlZE1vdmVzKVxuXHRcdFx0e1xuXHRcdFx0XHRHYW1lLkNoaXA/WyxdIGNoaXBzQ29weSA9IChHYW1lLkNoaXA/WyxdKWdhbWUuQ2hpcHMuQ2xvbmUoKTtcblx0XHRcdFx0aWYgKEdhbWUuTW92ZUFuZENoZWNrRm9yV2luKGNoaXBzQ29weSwgZ2FtZS5DdXJyZW50Q2hpcCwgR2FtZS5XSU4sIGFsbG93ZWRNb3ZlLkNvbHVtbkluZGV4KSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdENvbnNvbGUuV3JpdGVMaW5lKFwiV2lubmluZyBtb3ZlIVwiKTtcblx0XHRcdFx0XHRyZXR1cm4gVGFzay5Gcm9tUmVzdWx0PEdhbWUuTW92ZT4oYWxsb3dlZE1vdmUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGJvb2wgb2tNb3ZlID0gdHJ1ZTtcblxuXHRcdFx0XHRcdC8vIG5vdCBhIHdpbiBtb3ZlXG5cdFx0XHRcdFx0Zm9yZWFjaCAodmFyIGNvbEluZGV4IGluIEdhbWUuR2V0UG9zc2libGVNb3ZlcyhjaGlwc0NvcHkpKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdEdhbWUuQ2hpcD9bLF0gY2hpcHNDb3B5MiA9IChHYW1lLkNoaXA/WyxdKWNoaXBzQ29weS5DbG9uZSgpO1xuXHRcdFx0XHRcdFx0aWYgKEdhbWUuTW92ZUFuZENoZWNrRm9yV2luKGNoaXBzQ29weTIsIG90aGVyQ2hpcCwgR2FtZS5XSU4sIGNvbEluZGV4KSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0b2tNb3ZlID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gbW92ZSBpcyBhZGRlZCB0byBva01vdmVzLCBpZiBvcHBvbmVudCBkb2VzIG5vdCB3aW5cblx0XHRcdFx0XHRpZiAob2tNb3ZlKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdG9rTW92ZXMuQWRkKGFsbG93ZWRNb3ZlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gQ2hlY2sgaWYgdGhlIG9wcG9uZW50IGNhbiB3aW4gYW5kIHByZXZlbnQuXG5cdFx0XHRmb3JlYWNoICh2YXIgYWxsb3dlZE1vdmUgaW4gYWxsb3dlZE1vdmVzKVxuXHRcdFx0e1xuXHRcdFx0XHRHYW1lLkNoaXA/WyxdIGNoaXBzQ29weSA9IChHYW1lLkNoaXA/WyxdKWdhbWUuQ2hpcHMuQ2xvbmUoKTtcblx0XHRcdFx0aWYgKEdhbWUuTW92ZUFuZENoZWNrRm9yV2luKGNoaXBzQ29weSwgb3RoZXJDaGlwLCBHYW1lLldJTiwgYWxsb3dlZE1vdmUuQ29sdW1uSW5kZXgpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Q29uc29sZS5Xcml0ZUxpbmUoXCJQcmV2ZW50aW5nIHdpbm5pbmcgbW92ZSFcIik7XG5cdFx0XHRcdFx0cmV0dXJuIFRhc2suRnJvbVJlc3VsdDxHYW1lLk1vdmU+KGFsbG93ZWRNb3ZlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBibG9ja2luZyAzIGFyZSBnb29kIG9rTW92ZVxuXHRcdFx0Zm9yZWFjaCAodmFyIG9rTW92ZSBpbiBva01vdmVzKVxuXHRcdFx0e1xuXHRcdFx0XHRHYW1lLkNoaXA/WyxdIGNoaXBzQ29weSA9IChHYW1lLkNoaXA/WyxdKWdhbWUuQ2hpcHMuQ2xvbmUoKTtcblx0XHRcdFx0aWYgKEdhbWUuTW92ZUFuZENoZWNrRm9yV2luKGNoaXBzQ29weSwgb3RoZXJDaGlwLCBHYW1lLldJTiAtIDEsIG9rTW92ZS5Db2x1bW5JbmRleCkpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRDb25zb2xlLldyaXRlTGluZShcIkkgdGhpbmsgSSdtIGJlaW5nIGNsZXZlciFcIik7XG5cdFx0XHRcdFx0cmV0dXJuIFRhc2suRnJvbVJlc3VsdDxHYW1lLk1vdmU+KG9rTW92ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gY2FuIEkgaGF2ZSB0aHJlZSBpbiBhIHJvdz9cblx0XHRcdGZvcmVhY2ggKHZhciBva01vdmUgaW4gb2tNb3Zlcylcblx0XHRcdHtcblx0XHRcdFx0R2FtZS5DaGlwP1ssXSBjaGlwc0NvcHkgPSAoR2FtZS5DaGlwP1ssXSlnYW1lLkNoaXBzLkNsb25lKCk7XG5cdFx0XHRcdGlmIChHYW1lLk1vdmVBbmRDaGVja0ZvcldpbihjaGlwc0NvcHksIGdhbWUuQ3VycmVudENoaXAsIEdhbWUuV0lOIC0gMSwgb2tNb3ZlLkNvbHVtbkluZGV4KSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdENvbnNvbGUuV3JpdGVMaW5lKFwiSGFoYSwgSSBoYXZlIHRocmVlIGluIGEgcm93IVwiKTtcblx0XHRcdFx0XHRyZXR1cm4gVGFzay5Gcm9tUmVzdWx0PEdhbWUuTW92ZT4ob2tNb3ZlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRSYW5kb20gcmFuZCA9IG5ldyBSYW5kb20oKTtcblx0XHRcdGlmIChTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLkNvdW50PEdhbWUuTW92ZT4ob2tNb3ZlcykgPiAwKVxuXHRcdFx0e1xuXHRcdFx0XHRpbnQgaW5kZXggPSByYW5kLk5leHQoMCwgU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5Db3VudDxHYW1lLk1vdmU+KG9rTW92ZXMpKTtcblx0XHRcdFx0Q29uc29sZS5Xcml0ZUxpbmUoXCJEb24ndCBrbm93LCBwaWNraW5nIHJhbmRvbS4uLlwiKTtcblx0XHRcdFx0cmV0dXJuIFRhc2suRnJvbVJlc3VsdDxHYW1lLk1vdmU+KFN5c3RlbS5MaW5xLkVudW1lcmFibGUuRWxlbWVudEF0PEdhbWUuTW92ZT4ob2tNb3ZlcyxpbmRleCkpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRpbnQgaW5kZXggPSByYW5kLk5leHQoMCwgU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5Db3VudDxHYW1lLk1vdmU+KGFsbG93ZWRNb3ZlcykpO1xuXHRcdFx0XHRDb25zb2xlLldyaXRlTGluZShcIkRvbid0IGhhdmUgYSBnb29kIGZlZWxpbmcsIGJ1dCBubyBjbHVlLCBwaWNraW5nIHJhbmRvbS4uLlwiKTtcblx0XHRcdFx0cmV0dXJuIFRhc2suRnJvbVJlc3VsdDxHYW1lLk1vdmU+KFN5c3RlbS5MaW5xLkVudW1lcmFibGUuRWxlbWVudEF0PEdhbWUuTW92ZT4oYWxsb3dlZE1vdmVzLGluZGV4KSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG4iLCJ1c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcbnVzaW5nIFN5c3RlbS5MaW5xO1xudXNpbmcgU3lzdGVtLlRocmVhZGluZy5UYXNrcztcblxubmFtZXNwYWNlIENvbm5lY3RGb3VyXG57XG5cdGNsYXNzIEh1bWFuQ29udHJvbGxlciA6IElDb250cm9sbGVyXG5cdHtcblx0XHRwcml2YXRlIHJlYWRvbmx5IEJvYXJkIGJvYXJkO1xuXG5cdFx0cHVibGljIEh1bWFuQ29udHJvbGxlcihCb2FyZCBib2FyZClcblx0XHR7XG5cdFx0XHR0aGlzLmJvYXJkID0gYm9hcmQ7XG5cdFx0fVxuXG5cdFx0cHVibGljIGFzeW5jIFRhc2s8R2FtZS5Nb3ZlPiBTZWxlY3QoR2FtZSBnYW1lLCBJRW51bWVyYWJsZTxHYW1lLk1vdmU+IGFsbG93ZWRNb3Zlcylcblx0XHR7XG5cdFx0XHRUYXNrQ29tcGxldGlvblNvdXJjZTxpbnQ+IHRhc2tDb21wbGV0aW9uU291cmNlID0gbnVsbDtcblxuXHRcdFx0Q29sdW1uU2VsZWN0ZWRFdmVudEhhbmRsZXIgY29sdW1uU2VsZWN0ZWRIYW5kbGVyID0gKGludCBjb2x1bW5JbmRleCkgPT4gdGFza0NvbXBsZXRpb25Tb3VyY2UuU2V0UmVzdWx0KGNvbHVtbkluZGV4KTtcblxuXHRcdFx0Ym9hcmQuQ29sdW1uU2VsZWN0ZWQgKz0gY29sdW1uU2VsZWN0ZWRIYW5kbGVyO1xuXG5cdFx0XHRHYW1lLk1vdmUgc2VsZWN0ZWRNb3ZlO1xuXHRcdFx0ZG9cblx0XHRcdHtcblx0XHRcdFx0dGFza0NvbXBsZXRpb25Tb3VyY2UgPSBuZXcgVGFza0NvbXBsZXRpb25Tb3VyY2U8aW50PigpO1xuXHRcdFx0XHRpbnQgc2VsZWN0ZWRDb2x1bW5JbmRleCA9IGF3YWl0IHRhc2tDb21wbGV0aW9uU291cmNlLlRhc2s7XG5cdFx0XHRcdHNlbGVjdGVkTW92ZSA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuU2luZ2xlT3JEZWZhdWx0PEdhbWUuTW92ZT4oYWxsb3dlZE1vdmVzLChTeXN0ZW0uRnVuYzxHYW1lLk1vdmUsYm9vbD4pKG1vdmUgPT4gbW92ZS5Db2x1bW5JbmRleCA9PSBzZWxlY3RlZENvbHVtbkluZGV4KSk7XG5cdFx0XHR9IHdoaWxlIChzZWxlY3RlZE1vdmUgPT0gbnVsbCk7XG5cblx0XHRcdGJvYXJkLkNvbHVtblNlbGVjdGVkIC09IGNvbHVtblNlbGVjdGVkSGFuZGxlcjtcblxuXHRcdFx0cmV0dXJuIHNlbGVjdGVkTW92ZTtcblx0XHR9XG5cdH1cbn1cbiJdCn0K
