import { BrowserRouter, Route } from "react-router-dom";
import { Home } from '../pages/Home';
import { NewRoom } from '../pages/NewRoom';
import { AuthProvider } from "../contexts/auth";

export function Router() {
    return (
        <AuthProvider>
            <BrowserRouter>
            <Route path="/" exact component={Home}/>
            <Route path="/rooms/new" component={NewRoom}/>
        </BrowserRouter>
        </AuthProvider>
    )
}
