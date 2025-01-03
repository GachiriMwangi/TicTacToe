class TicTacToe:
    def __init__(self):
        self.board = [' ' for _ in range(9)]
        self.current_winner = None

    def print_board(self):
        for row in [self.board[i*3:(i+1)*3] for i in range(3)]:
            print('| ' + ' | '.join(row) + ' |')

    def available_moves(self):
        return [i for i, spot in enumerate(self.board) if spot == ' ']

    def empty_squares(self):
        return ' ' in self.board

    def num_empty_squares(self):
        return self.board.count(' ')

    def make_move(self, square, letter):
        if self.board[square] == ' ':
            self.board[square] = letter
            if self.winner(square, letter):
                self.current_winner = letter
            return True
        return False

    def winner(self, square, letter):
        # Check row
        row_ind = square // 3
        row = self.board[row_ind*3:(row_ind + 1)*3]
        if all([spot == letter for spot in row]):
            return True

        # Check column
        col_ind = square % 3
        column = [self.board[col_ind+i*3] for i in range(3)]
        if all([spot == letter for spot in column]):
            return True

        # Check diagonal
        if square % 2 == 0:
            diagonal1 = [self.board[i] for i in [0, 4, 8]]
            if all([spot == letter for spot in diagonal1]):
                return True
            diagonal2 = [self.board[i] for i in [2, 4, 6]]
            if all([spot == letter for spot in diagonal2]):
                return True

        return False

def minimax(board, maximizing, alpha, beta):
    # Base cases
    if board.current_winner == 'X':
        return 1
    elif board.current_winner == 'O':
        return -1
    elif not board.empty_squares():
        return 0

    if maximizing:
        max_eval = float('-inf')
        for move in board.available_moves():
            board.make_move(move, 'X')
            eval = minimax(board, False, alpha, beta)
            board.board[move] = ' '
            board.current_winner = None
            max_eval = max(max_eval, eval)
            alpha = max(alpha, eval)
            if beta <= alpha:
                break
        return max_eval
    else:
        min_eval = float('inf')
        for move in board.available_moves():
            board.make_move(move, 'O')
            eval = minimax(board, True, alpha, beta)
            board.board[move] = ' '
            board.current_winner = None
            min_eval = min(min_eval, eval)
            beta = min(beta, eval)
            if beta <= alpha:
                break
        return min_eval

def get_best_move(board):
    best_score = float('-inf')
    best_move = None
    alpha = float('-inf')
    beta = float('inf')
    
    for move in board.available_moves():
        board.make_move(move, 'X')
        score = minimax(board, False, alpha, beta)
        board.board[move] = ' '
        board.current_winner = None
        if score > best_score:
            best_score = score
            best_move = move
    return best_move

def play():
    game = TicTacToe()
    while game.empty_squares():
        game.print_board()
        
        # AI move
        move = get_best_move(game)
        game.make_move(move, 'X')
        print(f'AI moved to square {move}')
        
        if game.current_winner:
            game.print_board()
            print('AI wins!')
            return
        
        if not game.empty_squares():
            game.print_board()
            print('Tie game!')
            return
            
        # Human move
        valid_square = False
        while not valid_square:
            square = input('Enter your move (0-8): ')
            try:
                square = int(square)
                if square not in game.available_moves():
                    raise ValueError
                valid_square = True
            except ValueError:
                print('Invalid square. Try again.')
                
        game.make_move(square, 'O')
        
        if game.current_winner:
            game.print_board()
            print('You win!')
            return

if __name__ == '__main__':
    play()