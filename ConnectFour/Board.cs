using Bridge.Html5;
using System;
using System.Threading.Tasks;

namespace ConnectFour
{
	delegate void ColumnSelectedEventHandler(int columnIndex);

	delegate void ColorChangedEventHandler(string color);

	class Board
	{
		private const string COLOR_PLAYER_1 = "blue";
		private const string COLOR_PLAYER_2 = "red";
		private const string COLOR_RASTER = "#ffe74d";

		private readonly HTMLCanvasElement canvas;
		private readonly HTMLImageElement imageController1;
		private readonly HTMLImageElement imageController2;
		private readonly TaskCompletionSource<int> loadedImageController1 = new TaskCompletionSource<int>();
		private readonly TaskCompletionSource<int> loadedImageController2 = new TaskCompletionSource<int>();

		private event ColorChangedEventHandler ColorChanged;

		public event ColumnSelectedEventHandler ColumnSelected;

		public Node Root { get; }

		public Board()
		{
			canvas = new HTMLCanvasElement();

			var divElement = new HTMLDivElement();

			divElement.Style.MarginLeft = "10px";

			Func<int, HTMLButtonElement> createButton = (int columnIndex) =>
			{
				var button = new HTMLButtonElement
				{
					OnClick = (_) => { ColumnSelected?.Invoke(columnIndex); }
				};
				button.Style.Width = "50px";
				button.Style.Height = "50px";
				button.Style.MarginRight = "10px";
				button.Style.MarginBottom = "10px";
				ColorChanged += (c) => button.Style.Background = c;

				return button;
			};

			divElement.AppendChild(createButton(0));
			divElement.AppendChild(createButton(1));
			divElement.AppendChild(createButton(2));
			divElement.AppendChild(createButton(3));
			divElement.AppendChild(createButton(4));
			divElement.AppendChild(createButton(5));
			divElement.AppendChild(createButton(6));

			Root = new HTMLDivElement();
			Root.AppendChild(divElement);
			Root.AppendChild(canvas);

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

			ColorChanged?.Invoke(game.CurrentChip == Game.Chip.Player1 ? COLOR_PLAYER_1 : COLOR_PLAYER_2);

			var ctx = (CanvasRenderingContext2D)canvas.GetContext("2d");

			canvas.Width = game.Chips.GetLength(1) * 60 + 10;
			canvas.Height = game.Chips.GetLength(0) * 60 + 10;

			ctx.FillStyle = COLOR_RASTER;
			ctx.FillRect(0, 0, canvas.Width, canvas.Height);

			for (int row = 0; row < game.Chips.GetLength(0); row++)
			{
				for (int col = 0; col < game.Chips.GetLength(1); col++)
				{
					if (game.Chips[row, col] == Game.Chip.Player1)
					{
						ctx.DrawImage(imageController1, 10 + col * 60, 10 + row * 60, 50d, 50d);
					}
					else if (game.Chips[row, col] == Game.Chip.Player2)
					{
						ctx.DrawImage(imageController2, 10 + col * 60, 10 + row * 60, 50d, 50d);
					}
					else
					{
						ctx.BeginPath();
						ctx.FillStyle = "#f0f0f0";
						ctx.Ellipse(10 + 25 + col * 60, 10 + 25 + row * 60, 25, 25, 0, 0, 2 * Math.PI);
						ctx.Fill();
					}
				}
			}
		}
	}
}
