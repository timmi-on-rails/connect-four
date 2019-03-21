using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConnectFour
{
	delegate void GameUpdateHandler(Game game);

	class Game
	{
		public event GameUpdateHandler OnUpdate;

		public enum Chip
		{
			NONE,
			C1,
			C2
		}

		public Chip currentChip = Chip.C1;

		private const int rows = 6;
		private const int cols = 7;

		public Chip[,] chips = new Chip[rows, cols];

		public IController Controller1 { get; set; }

		public IController Controller2 { get; set; }

		private int win = 4;

		public async Task Run()
		{
			
			while (true)
			{
				List<Move> moves = new List<Move>();
				for (int i = 0; i < cols; i++)
					if (chips[0, i] == Chip.NONE)
						moves.Add(new Move { Index = i });

				Move m = currentChip == Chip.C1 ? await Controller1.Select(moves) : await Controller2.Select(moves);

				if (CheckForWin(m))
				{
					Console.WriteLine("player " + currentChip + " wins!");
					OnUpdate?.Invoke(this);
					break;
				}

				OnUpdate?.Invoke(this);

				currentChip = currentChip == Chip.C1 ? Chip.C2 : Chip.C1;
			}
		}

		private bool CheckForWin(Move m)
		{
			int i;
			for (i = 0; i < rows; i++)
				if (chips[i, m.Index] != 0)
					break;
			chips[i - 1, m.Index] = currentChip;
			int row = i - 1;
			int col = m.Index;

			if (Row(row, col, 0, 1) || Row(row, col, 1, 0) || Row(row, col, 1, 1) || Row(row, col, 1, -1))
				return true;

			return false;
		}

		private bool Row(int row, int col, int drow, int dcol)
		{
			return C(drow, dcol) + C(-drow, -dcol) + 1 >= win;

			int C(int drow2, int dcol2)
			{
				int c = 0;
				for (int i = 1; i < win; i++)
					if (col + i * dcol2 >= 0 && col + i * dcol2 < cols && row + i * drow2 >= 0 && row + i * drow2 < rows && chips[row + i * drow2, col + i * dcol2] == currentChip)
						if (currentChip == chips[row + i * drow2, col + i * dcol2])
							c++;
						else break;
				return c;
			}
		}
	}
}
