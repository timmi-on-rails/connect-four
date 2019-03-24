using Bridge.Html5;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ConnectFour
{
	delegate void GameUpdatedEventHandler(Game game);

	class Game
	{
		public const int ROWS = 6;
		public const int COLUMNS = 7;
		private const int WIN = 4;

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

				List<Move> moves = new List<Move>();
				for (int i = 0; i < COLUMNS; i++)
				{
					if (!Chips[0, i].HasValue)
					{
						moves.Add(new Move(i));
					}
				}

				Move selectedMove = (CurrentChip == Chip.Mouse ? await Controller1.Select(this, moves) : await Controller2.Select(this, moves));

				if (MoveAndCheckForWin(selectedMove))
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

		private bool MoveAndCheckForWin(Move m)
		{
			int i;
			for (i = 0; i < ROWS; i++)
				if (Chips[i, m.ColumnIndex].HasValue)
					break;
			Chips[i - 1, m.ColumnIndex] = CurrentChip;
			int row = i - 1;
			int col = m.ColumnIndex;

			return CheckAxis(row, col, 0, 1)
				|| CheckAxis(row, col, 1, 0)
				|| CheckAxis(row, col, 1, 1)
				|| CheckAxis(row, col, 1, -1);
		}

		private bool CheckAxis(int row, int col, int drow, int dcol)
		{
			return CheckOneSide(drow, dcol) + CheckOneSide(-drow, -dcol) + 1 >= WIN;

			int CheckOneSide(int drow2, int dcol2)
			{
				int c = 0;
				for (int i = 1; i < WIN; i++)
					if (col + i * dcol2 >= 0 && col + i * dcol2 < COLUMNS && row + i * drow2 >= 0 && row + i * drow2 < ROWS
						&& Chips[row + i * drow2, col + i * dcol2] == CurrentChip)
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
