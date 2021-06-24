import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Home } from '../pages/Home';
import { NewRoom } from '../pages/NewRoom';
import { AuthProvider } from "../contexts/auth";
import { Room } from "../pages/Room";

export function Router() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact component={Home}/>
                    <Route path="/rooms/new" component={NewRoom}/>
                    <Route path="/rooms/:id" component={Room}/>
                </Switch>
            </BrowserRouter>
        </AuthProvider>
    )
}
