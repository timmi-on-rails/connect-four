using Bridge.Html5;
using System;
using System.Threading.Tasks;

namespace ConnectFour
{
	delegate void ColumnSelectedEventHandler(int columnIndex);

	delegate void ColorChangedEventHandler(string color);

	class Board
	{
		private const string COLOR_PLAYER_1 = "#E44A4A";
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



		const int V1 = 15;
		const int w = 60;
		const int V = V1 + w;

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
				if (y > V1 && y < V)
				{
					for (int col = 0; col < Game.COLUMNS; col++)
					{
						if (x > V1 + col * V && x < V + col * V)
						{
							ColumnSelected?.Invoke(col);
						}
					}
				}
			};

			Root = canvas;

			imageController1 = new HTMLImageElement();
			imageController1.OnLoad = (_) => loadedImageController1.SetResult(0);
			imageController1.Src = "mouse.png";

			imageController2 = new HTMLImageElement();
			imageController2.OnLoad = (_) => loadedImageController2.SetResult(0);
			imageController2.Src = "chip2.svg";
		}

		public async Task Paint(Game game)
		{
			await loadedImageController1.Task;
			await loadedImageController2.Task;

			var ctx = (CanvasRenderingContext2D)canvas.GetContext("2d");



			canvas.Width = game.Chips.GetLength(1) * V + V1;
			canvas.Height = (game.Chips.GetLength(0) + 1) * V + V1;

			ctx.FillStyle = COLOR_RASTER;
			ctx.FillRect(0, 0, canvas.Width, canvas.Height);

			for (int col = 0; col < game.Chips.GetLength(1); col++)
			{
				ctx.FillStyle = game.CurrentChip == Game.Chip.Mouse ? COLOR_PLAYER_1 : COLOR_PLAYER_2;
				ctx.FillRect(V1 + col * V, V1, w, w);
			}

			for (int row = 0; row < game.Chips.GetLength(0); row++)
			{
				for (int col = 0; col < game.Chips.GetLength(1); col++)
				{
					if (game.Chips[row, col] == Game.Chip.Mouse)
					{
						ctx.DrawImage(imageController1, V1 + col * V, V1 + (row + 1) * V, w * 1d, w * 1d);
					}
					else if (game.Chips[row, col] == Game.Chip.Cat)
					{
						ctx.DrawImage(imageController2, V1 + col * V, V1 + (row + 1) * V, w * 1d, w * 1d);
					}
					else
					{
						ctx.BeginPath();
						ctx.FillStyle = COLOR_CHIP_BACKGROUND;
						ctx.Ellipse(V1 + w / 2 + col * V, V1 + w / 2 + (row + 1) * V, w / 2, w / 2, 0, 0, 2 * Math.PI);
						ctx.Fill();
					}
				}
			}
		}
	}
}
