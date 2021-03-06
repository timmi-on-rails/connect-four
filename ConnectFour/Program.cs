using Bridge.Html5;
using System;

namespace ConnectFour
{
	public class Program
	{
		public static void Main()
		{
			Console.WriteLine($"Version: {Version.Info}");

			Board board = new Board();
			Document.Body.AppendChild(board.Root);
			Document.Body.Style.BackgroundImage = "url('background.png')";

			Game game = new Game
			{
				Controller1 = new HumanController(board),
				Controller2 = new HumanController(board)
			};

			game.GameUpdated += async (g) => await board.Paint(g);

			_ = game.Run();
		}
	}
}
