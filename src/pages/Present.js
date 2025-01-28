import ListForm from "../components/ListForm";
import '../index.css';
import Header from "../components/Header";
export default function Present() {
    return (
    <div className="present-page">

        <main className="main-form">
            <Header />        
            <ListForm />
        </main>
        </div>
    );
}