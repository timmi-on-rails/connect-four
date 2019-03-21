using System.Collections.Generic;
using System.Threading.Tasks;

namespace ConnectFour
{
	interface IController
	{
		/// <summary>
		/// The controller has to select one move of all available moves.
		/// </summary>
		Task<Game.Move> Select(Game game, IEnumerable<Game.Move> allowedMoves);
	}
}
