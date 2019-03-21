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

			Game game = new Game
			{
				Controller1 = new HumanController(board),
				Controller2 = new HumanController(board)
			};

			game.GameUpdated += board.Paint;

			_ = game.Run();
		}
	}
}
