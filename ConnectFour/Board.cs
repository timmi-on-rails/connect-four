using Bridge.Html5;
using System;
using System.Threading.Tasks;

namespace ConnectFour
{
	delegate void ColumnSelectedEventHandler(int columnIndex);

	delegate void ColorChangedEventHandler(string color);

	class Board
	{
		private const string COLOR_PLAYER_1 = "#BAC8D3";
		private const string COLOR_PLAYER_2 = "#F0A30A";
		private const string COLOR_RASTER = "#FFE74D";
		private const string COLOR_CHIP_BACKGROUND = "white";

		private readonly HTMLCanvasElement canvas;
		private readonly HTMLImageElement imageController1;
		private readonly HTMLImageElement imageController2;
		private readonly TaskCompletionSource<int> loadedImageController1 = new TaskCompletionSource<int>();
		private readonly TaskCompletionSource<int> loadedImageController2 = new TaskCompletionSource<int>();

		public event ColumnSelectedEventHandler ColumnSelected;

		public Node Root { get; }

		public Board()
		{
			canvas = new HTMLCanvasElement();

			canvas.Style.Position = Position.Absolute;
			canvas.Style.Top = "50%";
			canvas.Style.Left = "50%";
			canvas.Style.Transform = "translate(-50%, -50%)";
			canvas.OnClick = (e) =>
			{
				var x = e.PageX - canvas.OffsetLeft + 0.5 * canvas.Width;
				var y = e.PageY - canvas.OffsetTop + 0.5 * canvas.Height;

				Console.WriteLine($"X: {x}, Y: {y}");
				if (y > 10 && y < 60)
				{
					for (int col = 0; col < Game.COLUMNS; col++)
					{
						if (x > 10 + col * 60 && x < 60 + col * 60)
						{
							ColumnSelected?.Invoke(col);
						}
					}

				}
			};

			Root = canvas;

			imageController1 = new HTMLImageElement();
			imageController1.OnLoad = (_) => loadedImageController1.SetResult(0);
			imageController1.Src = "chip1.svg";

			imageController2 = new HTMLImageElement();
			imageController2.OnLoad = (_) => loadedImageController2.SetResult(0);
			imageController2.Src = "chip2.svg";
		}

		public async Task Paint(Game game)
		{
			await loadedImageController1.Task;
			await loadedImageController2.Task;

			var ctx = (CanvasRenderingContext2D)canvas.GetContext("2d");

			canvas.Width = game.Chips.GetLength(1) * 60 + 10;
			canvas.Height = (game.Chips.GetLength(0) + 1) * 60 + 10;

			ctx.FillStyle = COLOR_RASTER;
			ctx.FillRect(0, 0, canvas.Width, canvas.Height);

			for (int col = 0; col < game.Chips.GetLength(1); col++)
			{
				ctx.FillStyle = game.CurrentChip == Game.Chip.Mouse ? COLOR_PLAYER_1 : COLOR_PLAYER_2;
				ctx.FillRect(10 + col * 60, 10, 50, 50);
			}

			for (int row = 0; row < game.Chips.GetLength(0); row++)
			{
				for (int col = 0; col < game.Chips.GetLength(1); col++)
				{
					if (game.Chips[row, col] == Game.Chip.Mouse)
					{
						ctx.DrawImage(imageController1, 10 + col * 60, 10 + (row + 1) * 60, 50d, 50d);
					}
					else if (game.Chips[row, col] == Game.Chip.Cat)
					{
						ctx.DrawImage(imageController2, 10 + col * 60, 10 + (row + 1) * 60, 50d, 50d);
					}
					else
					{
						ctx.BeginPath();
						ctx.FillStyle = COLOR_CHIP_BACKGROUND;
						ctx.Ellipse(10 + 25 + col * 60, 10 + 25 + (row + 1) * 60, 25, 25, 0, 0, 2 * Math.PI);
						ctx.Fill();
					}
				}
			}
		}
	}
}
