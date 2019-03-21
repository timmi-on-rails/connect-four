using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConnectFour
{
	class HumanController : IController
	{
		private readonly Board board;

		public HumanController(Board board)
		{
			this.board = board;
		}

		public async Task<Game.Move> Select(Game game, IEnumerable<Game.Move> allowedMoves)
		{
			TaskCompletionSource<int> taskCompletionSource = null;

			ColumnSelectedEventHandler columnSelectedHandler = (int columnIndex) => taskCompletionSource.SetResult(columnIndex);

			board.ColumnSelected += columnSelectedHandler;

			Game.Move selectedMove;
			do
			{
				taskCompletionSource = new TaskCompletionSource<int>();
				int selectedColumnIndex = await taskCompletionSource.Task;
				selectedMove = allowedMoves.SingleOrDefault(move => move.ColumnIndex == selectedColumnIndex);
			} while (selectedMove == null);

			board.ColumnSelected -= columnSelectedHandler;

			return selectedMove;
		}
	}
}
