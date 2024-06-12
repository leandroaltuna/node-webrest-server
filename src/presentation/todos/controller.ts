import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";


const todos = [
    { id: 1, text: 'Buy milk', completedAt: new Date() },
    { id: 2, text: 'Buy bread', completedAt: null },
    { id: 3, text: 'Buy butter', completedAt: new Date() },
];

export class TodosController {

    //* DI
    constructor(){}

    public getTodos = async( req: Request, res: Response ) => {
        
        //---- Codigo para consultar registros de memoria ----//
        // return res.json( todos );

        //=== Codigo para consultar registros from PostgreSQL ===//
        const todo = await prisma.todo.findMany()
        return res.json( todo );

    }

    public getTodosById = async( req: Request, res: Response ) => {
        
        const id = +req.params.id; // El signo + hace la conversion de string to number
        if ( isNaN( id ) ) return res.status( 400 ).json({ error: 'ID argument is not a number' });
        
        //---- Codigo para consultar registro by id from memoria ----//
        // const todo = todos.find( todo => todo.id === id );
        
        // ( todo )
        //     ? res.json( todo )
        //     : res.status(404).json({ error: `TODO with id ${ id } not found` })

        //=== Codigo para consultar registro by id from PostgreSQL ===//
        const todo = await prisma.todo.findFirst({
            where: {
                id: id
            }
        });
        
        ( todo )
            ? res.json( todo )
            : res.status(404).json({ error: `TODO with id ${ id } not found` })

    }

    public createTodo = async( req: Request, res: Response ) => {

        //--- Codigo sin DTOS ---//
        // const { text } = req.body;
        // if ( !text ) return res.status( 400 ).json({ error: 'Text argument is required' });

        //---- Codigo para crear nuevos registros en memoria ----//
        /*
        const newTodo = {
            id: todos.length + 1,
            text: text,
            completedAt: null,
        }
        todos.push( newTodo );

        res.json( newTodo );
        */

        //=== Codigo para crear nuevo registro en PostgreSQL ===//
        // const todo = await prisma.todo.create({
        //     data: { text }
        // });

        // res.json( todo );


        //=================================================//
        
        //-- Codigo con DTOS ---//
        const [ error, createTodoDto ] = CreateTodoDto.create( req.body );

        if ( error ) return res.status( 400 ).json( error );

         const todo = await prisma.todo.create({
            data: createTodoDto!
        });

        res.json( todo );
       
    }

    public updateTodo = async( req: Request, res: Response ) => {

        //--- Codigo sin DTOS ---//
        // const id = +req.params.id;
        // if( isNaN( id ) ) return res.status( 400 ).json({ error: `ID argument is not a number` });

        //---- Codigo para actualizar registro by id en memoria ----//
        // const todo = todos.find( todo => todo.id === id );
        // if( !todo ) return res.status( 404 ).json({ error: `TODO with id ${ id } not found` });
        
        // //! OJO, los objetos pasan como referencia en json y aca se esta actualizando los datos solo en memoria.
        // const { text, completedAt } = req.body;
        
        // todo.text = text || todo.text; // Si el parametro text existe toma el valor del nuevo valor, sino obtiene el valor actual.
        
        // ( completedAt === 'null' )
        //     ? todo.completedAt = null
        //     : todo.completedAt = new Date( completedAt || todo.completedAt );

        // res.json( todo );


        //=== Codigo para actualizar registro en PostgreSQL ===//
        // const todo = await prisma.todo.findFirst({
        //     where: { id }
        // });
        // if ( !todo ) return res.status( 404 ).json({ error: `TODO with id ${ id } not found` });

        // const { text, completedAt } = req.body;

        // const updatedTodo = await prisma.todo.update({
        //     where: { id },
        //     data: { 
        //         text, 
        //         completedAt: ( completedAt ) ? new Date( completedAt ) : null 
        //     }
        // });

        // res.json( updatedTodo );

        //===================================================//

        //-- Codigo con DTOS ---//
        const id = +req.params.id;
        const [ error, updateTodoDto ] = UpdateTodoDto.create({ ...req.body, id });

        if ( error ) return res.status( 400 ).json({ error });

        const todo = await prisma.todo.findFirst({
            where: { id }
        });
        if ( !todo ) return res.status( 404 ).json({ error: `TODO with id ${ id } not found` });

        const updatedTodo = await prisma.todo.update({
            where: { id },
            data: updateTodoDto!.values
        });

        res.json( updatedTodo );

    }

    public deleteTodo = async( req: Request, res: Response ) => {

        const id = +req.params.id;

        //---- Codigo para elimiar registro by id en memoria ----//
        // const todo = todos.find( todo => todo.id === id );

        // if ( !todo ) return res.json({ error: `TODO with id ${ id } not found` });
        
        // todos.splice( todos.indexOf( todo ), 1 );

        // res.json( todo );


        //=== Codigo para eliminar registro by id en PostgreSQL ===//
        const todo = await prisma.todo.findFirst({
            where: { id }
        });
        if ( !todo ) return res.status( 404 ).json({ error: `TODO with id ${ id } not found` });

        const deleted = await prisma.todo.delete({
            where: { id }
        });

        ( deleted )
            ? res.json( deleted )
            : res.json( 400 ).json({ error: `TODO with id ${ id } do not exist` });

    }

}