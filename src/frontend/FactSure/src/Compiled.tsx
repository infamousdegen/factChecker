import {Search} from '@/Searchbar';
import {Navbar} from '@/Navbar';
import {Cards} from '@/Cards';

export function Compiled(){
    return (
        <div>
            <Navbar/>
            <Search setResults={undefined}/>
            <Cards/>
        </div>
    )
}