import express, { Router } from 'express';
import path from 'path';


interface Options{
    port: number;
    routes: Router;
    public_path?: string;
}

export class Server{

    public readonly app = express();
    private serverListener?: any;
    private readonly port: number;
    private readonly routes: Router;
    private readonly publicPath: string;

    constructor( options: Options ){
        const { port, routes, public_path = 'public' } = options;
        
        this.port = port;
        this.publicPath = public_path;
        this.routes = routes;
    }

    async start(){

        //* Middlewares
        this.app.use( express.json() ); // raw as json
        this.app.use( express.urlencoded({ extended: true }) ); //x-www-form-urlencoded

        //* Public Folder
        this.app.use( express.static( this.publicPath ) );

        //* Routes
        this.app.use( this.routes );

        //* SPA
        // Va a buscar las peticiones que no encuentre en la solicitud o carpeta "public"
        this.app.get( '*', ( req, res ) => {
            // console.log( req.url );
            // res.send( 'Hola Mundo desde server.ts' );

            const indePath = path.join( __dirname + `../../../${ this.publicPath }/index.html` );
            res.sendFile( indePath );
        })
    

        this.serverListener = this.app.listen( this.port, () =>{
            console.log( `Server running on port : ${ this.port }`);
        });

    }

    // Termina el proceso del servidor de express
    public close(){
        this.serverListener?.close();
    }

}