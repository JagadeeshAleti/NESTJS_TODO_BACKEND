import { Todo } from './todo.entity';
import { User } from './users.entity';

const entities = [User, Todo];

export { User as Users };
export { Todo as Todos };
export default entities;
