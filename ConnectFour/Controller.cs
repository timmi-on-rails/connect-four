using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConnectFour
{
	class Move
	{
		public int Index { get; set; }
	}

	interface IController
	{
		Task<Move> Select(IEnumerable<Move> moves);
	}

	class SomeController : IController
	{
		private readonly string name;

		public SomeController(string name)
		{
			this.name = name;
		}

		TaskCompletionSource<int> b = null;

		public void ButtonClick(int index)
		{
			b?.SetResult(index);
		}

		public async Task<Move> Select(IEnumerable<Move> moves)
		{
			string list = string.Join(", ", moves.Select(m => m.Index));
			Move mf;
			int index;
			do
			{
				b = new TaskCompletionSource<int>();

				index = await b.Task;
			} while ((mf = moves.SingleOrDefault(m => m.Index == index)) == null);

			//Console.WriteLine($"{name} chose column {index + 1}.");
			return mf;
		}
	}
}
