using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConnectFour
{
	class ComputerController : IController
	{
		public Task<Game.Move> Select(Game game, IEnumerable<Game.Move> allowedMoves)
		{
			Game.Chip otherChip = game.CurrentChip == Game.Chip.Cat ? Game.Chip.Mouse : Game.Chip.Cat;
			List<Game.Move> okMoves = new List<Game.Move>();

			// Check if I can win?
			foreach (var allowedMove in allowedMoves)
			{
				Game.Chip?[,] chipsCopy = (Game.Chip?[,])game.Chips.Clone();
				if (Game.MoveAndCheckForWin(chipsCopy, game.CurrentChip, Game.WIN, allowedMove.ColumnIndex))
				{
					Console.WriteLine("Winning move!");
					return Task.FromResult(allowedMove);
				}
				else
				{
					bool okMove = true;

					// not a win move
					foreach (var colIndex in Game.GetPossibleMoves(chipsCopy))
					{
						Game.Chip?[,] chipsCopy2 = (Game.Chip?[,])chipsCopy.Clone();
						if (Game.MoveAndCheckForWin(chipsCopy2, otherChip, Game.WIN, colIndex))
						{
							okMove = false;
						}
					}

					// move is added to okMoves, if opponent does not win
					if (okMove)
					{
						okMoves.Add(allowedMove);
					}
				}
			}

			// Check if the opponent can win and prevent.
			foreach (var allowedMove in allowedMoves)
			{
				Game.Chip?[,] chipsCopy = (Game.Chip?[,])game.Chips.Clone();
				if (Game.MoveAndCheckForWin(chipsCopy, otherChip, Game.WIN, allowedMove.ColumnIndex))
				{
					Console.WriteLine("Preventing winning move!");
					return Task.FromResult(allowedMove);
				}
			}

			// blocking 3 are good okMove
			foreach (var okMove in okMoves)
			{
				Game.Chip?[,] chipsCopy = (Game.Chip?[,])game.Chips.Clone();
				if (Game.MoveAndCheckForWin(chipsCopy, otherChip, Game.WIN - 1, okMove.ColumnIndex))
				{
					Console.WriteLine("I think I'm being clever!");
					return Task.FromResult(okMove);
				}
			}

			// can I have three in a row?
			foreach (var okMove in okMoves)
			{
				Game.Chip?[,] chipsCopy = (Game.Chip?[,])game.Chips.Clone();
				if (Game.MoveAndCheckForWin(chipsCopy, game.CurrentChip, Game.WIN - 1, okMove.ColumnIndex))
				{
					Console.WriteLine("Haha, I have three in a row!");
					return Task.FromResult(okMove);
				}
			}

			Random rand = new Random();
			if (okMoves.Count() > 0)
			{
				int index = rand.Next(0, okMoves.Count());
				Console.WriteLine("Don't know, picking random...");
				return Task.FromResult(okMoves.ElementAt(index));
			}
			else
			{
				int index = rand.Next(0, allowedMoves.Count());
				Console.WriteLine("Don't have a good feeling, but no clue, picking random...");
				return Task.FromResult(allowedMoves.ElementAt(index));
			}
		}
	}
}
