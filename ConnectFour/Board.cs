using Bridge.Html5;
using System;

namespace ConnectFour
{
	delegate void ColumnSelectedEventHandler(int columnIndex);

	delegate void ColorChangedEventHandler(string color);

	class Board
	{
		private const string COLOR_PLAYER_1 = "blue";
		private const string COLOR_PLAYER_2 = "red";

		private readonly HTMLCanvasElement canvas;

		private event ColorChangedEventHandler ColorChanged;

		public event ColumnSelectedEventHandler ColumnSelected;

		public Node Root { get; }

		public Board()
		{
			canvas = new HTMLCanvasElement();

			var divElement = new HTMLDivElement();

			Func<int, HTMLButtonElement> createButton = (int columnIndex) =>
			{
				var button = new HTMLButtonElement
				{
					OnClick = (e) => { ColumnSelected?.Invoke(columnIndex); }
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
		}

		public void Paint(Game game)
		{
			ColorChanged?.Invoke(game.CurrentChip == Game.Chip.Player1 ? COLOR_PLAYER_1 : COLOR_PLAYER_2);

			var ctx = (CanvasRenderingContext2D)canvas.GetContext("2d");

			canvas.Width = 550;
			canvas.Height = 500;

			for (int row = 0; row < game.Chips.GetLength(0); row++)
			{
				for (int col = 0; col < game.Chips.GetLength(1); col++)
				{
					string color = "#f0f0f0";

					if (game.Chips[row, col] == Game.Chip.Player1)
					{
						color = COLOR_PLAYER_1;
					}

					if (game.Chips[row, col] == Game.Chip.Player2)
					{
						color = COLOR_PLAYER_2;
					}

					ctx.FillStyle = color;
					ctx.FillRect(col * 60, row * 60, 50, 50);
				}
			}
		}
	}
}
