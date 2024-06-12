import { Router } from "express";
import { TodosController } from "./controller";
import { TodoDatasourceImpl } from "../../infraestructure/datasources/todo.datasource.impl";
import { TodoRepositoryImpl } from "../../infraestructure/repositories/todo.repository.impl";



export class TodoRoutes {

    static get routes(): Router {

        const router = Router();

        const dataSource = new TodoDatasourceImpl();
        const todoRepository = new TodoRepositoryImpl( dataSource );

        const todosController = new TodosController( todoRepository );

        router.get( '/', todosController.getTodos );
        router.get( '/:id', todosController.getTodosById );
        
        router.post( '/', todosController.createTodo );
        router.put( '/:id', todosController.updateTodo );
        router.delete( '/:id', todosController.deleteTodo );

        return router;

    }

}