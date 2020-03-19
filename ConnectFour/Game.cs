using Bridge.Html5;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConnectFour
{
	delegate void GameUpdatedEventHandler(Game game);

	class Game
	{
		public const int ROWS = 6;
		public const int COLUMNS = 7;
		public const int WIN = 4;

		public event GameUpdatedEventHandler GameUpdated;

		public enum Chip
		{
			Mouse,
			Cat
		}

		public Chip CurrentChip { get; private set; } = Chip.Mouse;

		public Chip?[,] Chips { get; } = new Chip?[ROWS, COLUMNS];

		public IController Controller1 { get; set; }

		public IController Controller2 { get; set; }

		public async Task Run()
		{
			while (true)
			{
				GameUpdated?.Invoke(this);

				List<Move> moves = GetPossibleMoves(Chips).Select(i => new Move(i)).ToList();

				Move selectedMove = (CurrentChip == Chip.Mouse ? await Controller1.Select(this, moves) : await Controller2.Select(this, moves));

				if (MoveAndCheckForWin(Chips, CurrentChip, WIN, selectedMove.ColumnIndex))
				{
					GameUpdated?.Invoke(this);
					Window.SetTimeout(() =>
					{
						Window.Alert($"{CurrentChip} wins!");
					});

					break;
				}

				CurrentChip = (CurrentChip == Chip.Mouse ? Chip.Cat : Chip.Mouse);
			}
		}

		public static IEnumerable<int> GetPossibleMoves(Chip?[,] chips)
		{
			for (int i = 0; i < COLUMNS; i++)
			{
				if (!chips[0, i].HasValue)
				{
					yield return i;
				}
			}
		}

		public static bool MoveAndCheckForWin(Chip?[,] chips, Chip currentChip, int win, int columnIndex)
		{
			int i;
			for (i = 0; i < ROWS; i++)
				if (chips[i, columnIndex].HasValue)
					break;
			chips[i - 1, columnIndex] = currentChip;
			int row = i - 1;
			int col = columnIndex;

			return CheckAxis(chips, currentChip, win, row, col, 0, 1)
				|| CheckAxis(chips, currentChip, win, row, col, 1, 0)
				|| CheckAxis(chips, currentChip, win, row, col, 1, 1)
				|| CheckAxis(chips, currentChip, win, row, col, 1, -1);
		}

		private static bool CheckAxis(Chip?[,] chips, Chip currentChip, int win, int row, int col, int drow, int dcol)
		{
			return CheckOneSide(drow, dcol) + CheckOneSide(-drow, -dcol) + 1 >= win;

			int CheckOneSide(int drow2, int dcol2)
			{
				int c = 0;
				for (int i = 1; i < win; i++)
					if (col + i * dcol2 >= 0 && col + i * dcol2 < COLUMNS && row + i * drow2 >= 0 && row + i * drow2 < ROWS
						&& chips[row + i * drow2, col + i * dcol2] == currentChip)
						c++;
					else
						break;
				return c;
			}
		}

		public class Move
		{
			public int ColumnIndex { get; }

			public Move(int columnIndex)
			{
				ColumnIndex = columnIndex;
			}
		}
	}
}
