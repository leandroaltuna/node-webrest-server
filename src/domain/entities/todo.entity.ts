

export class TodoEntity {

    constructor(

        public id: number,
        public text: string,
        public completedAt?: Date | null,

    ) {}

    get isCompleted() {
        
        // doble negacion -> !!, regresa true si la propiedad completedAt tiene un valor. !this.completedAt regresaria false si la propiedad completedAt tiene un valor
        return !!this.completedAt;
    }

    public static fromObject( object: { [key:string]: any } ): TodoEntity {

        const { id, text, completedAt } = object;

        if ( !id ) throw 'Id is required';
        if ( !text ) throw 'Text is required';

        let newCompletedAt;
        // valida si la propiedad CompletedAt tiene algun valor
        if ( completedAt ) {
            newCompletedAt = new Date( completedAt );
            
            // Valida si el valor es una fecha.
            if ( isNaN( newCompletedAt.getTime() ) ) {
                throw 'CompletedAt is not a valida date';
            }
        }

        return new TodoEntity( id, text, completedAt );

    }

}