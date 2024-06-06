import express from 'express';
import path from 'path';


interface Options{
    port: number;
    public_path?: string;
}

export class Server{

    private app = express();
    private readonly port: number;
    private readonly publicPath: string;

    constructor( options: Options ){
        const { port, public_path = 'public' } = options;
        
        this.port = port;
        this.publicPath = public_path;
    }

    async start(){

        //* Middlewares

        //* Public Folder
        this.app.use( express.static( this.publicPath ) );

        // Va a buscar las peticiones que no encuentre en la solicitud o carpeta "public"
        this.app.get( '*', ( req, res ) => {
            // console.log( req.url );
            // res.send( 'Hola Mundo desde server.ts' );

            const indePath = path.join( __dirname + `../../../${ this.publicPath }/index.html` );
            res.sendFile( indePath );
        })
    

        this.app.listen( this.port, () =>{
            console.log( `Server running on port : ${ this.port }`);
        });

    }

}