using Bridge.Html5;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConnectFour
{
	public class Program
	{
		public delegate void ButtonHandler(int index);
		public delegate void ColorHandler(string color);

		static HTMLCanvasElement canvas;
		static event ButtonHandler Selection;
		static event ColorHandler Color;


		public static void Main()
		{
			Console.WriteLine($"Version: {Version.Info}");

			canvas = new HTMLCanvasElement();

			var divElement = new HTMLDivElement();

			Func<int, HTMLButtonElement> createButton = (int index) =>
			{
				var button = new HTMLButtonElement
				{
					OnClick = (e) => { Selection?.Invoke(index); }
				};
				button.Style.Width = "50px";
				button.Style.Height = "50px";
				button.Style.MarginRight = "10px";
				button.Style.MarginBottom = "10px";
				Color += (c) => button.Style.Background = c;

				return button;

			};


			divElement.AppendChild(createButton(0));
			divElement.AppendChild(createButton(1));
			divElement.AppendChild(createButton(2));
			divElement.AppendChild(createButton(3));
			divElement.AppendChild(createButton(4));
			divElement.AppendChild(createButton(5));
			divElement.AppendChild(createButton(6));

			Document.Body.AppendChild(divElement);
			Document.Body.AppendChild(canvas);





			Console.WriteLine("Hello");


			Game game = new Game();

			Game_OnUpdate(game);
			Color?.Invoke(game.currentChip == Game.Chip.C1 ? "#f0f000" : "#00f0f0");

			game.OnUpdate += Game_OnUpdate;

			var controller1 = new SomeController("Player 1");
			game.Controller1 = controller1;

			SomeController controller2 = new SomeController("Player 2");
			game.Controller2 = controller2;

			Selection += (e) =>
			{
				if (game.currentChip == Game.Chip.C1)
					controller1.ButtonClick(e);
				else
					controller2.ButtonClick(e);
			};

			game.Run();
		}

		private static void Game_OnUpdate(Game game)
		{
			Color?.Invoke(game.currentChip == Game.Chip.C2 ? "#f0f000" : "#00f0f0");

			var ctx = (CanvasRenderingContext2D)canvas.GetContext("2d");

			canvas.Width = 550;
			canvas.Height = 500;

			for (int row = 0; row < game.chips.GetLength(0); row++)
				for (int col = 0; col < game.chips.GetLength(1); col++)
				{
					string color = "#f0f0f0";

					if (game.chips[row, col] == Game.Chip.C1)
					{
						color = "#f0f000";
					}

					if (game.chips[row, col] == Game.Chip.C2)
					{
						color = "#00f0f0";
					}

					ctx.FillStyle = color;
					ctx.FillRect(col * 60, row * 60, 50, 50);
				}
		}
	}
}
