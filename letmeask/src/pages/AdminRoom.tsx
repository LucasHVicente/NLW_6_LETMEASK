import { FormEvent, useState } from "react";
import { useHistory, useParams } from "react-router-dom"
import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { Question } from "../components/Question";

import { RoomCode } from '../components/RoomCode';
import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";
import  deleteImg  from '../assets/images/delete.svg';

import '../styles/room.scss'

type RoomParams = {
    id: string
}

export function AdminRoom() {
    const history = useHistory()
    const  { user } = useAuth()
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const {questions, title} = useRoom(roomId)
    const [newQuestion, setNewQuestion] = useState('');
    
    

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault()
        if(newQuestion.trimEnd() ==='') return;

        if(!user) throw new Error('You must be logged in');

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar,
            },
            isHighlighted: false,
            isAnswered: false,
        }

        await database.ref(`rooms/${roomId}/questions`).push(question)
        setNewQuestion('');
    } 

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })
        history.push('/')
    }

// TODO Modal de confirmação
    async function handleDeleteQuestion(questionId:string) {
        if(window.confirm('Tem certeza que você deseja excluir esta pergunta?')){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }
    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="logo"/>
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
                    </div>
                </div>
            </header>
            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {
                        questions&& <span>{questions.length} perguntas</span>
                    }
                </div>
                
                <div className="question-list">
                {
                    questions.map(question=>(
                        <Question 
                            key={question.id} 
                            content={question.content} 
                            author={question.author}  
                        >
                            <button
                                type="button"
                                onClick={()=>handleDeleteQuestion(question.id)}
                            >
                                <img src={deleteImg} alt="remover pergunta"/>
                            </button>
                        </Question>
                    ))
                }
                </div>
            </main>
        </div>
    )
}
