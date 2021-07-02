import {  useState } from "react";
import { useHistory, useParams } from "react-router-dom"
import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { Question } from "../components/Question";

import { RoomCode } from '../components/RoomCode';
import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";
import  deleteImg  from '../assets/images/delete.svg';
import  checkImg  from '../assets/images/check.svg';
import  answerImg  from '../assets/images/answer.svg';

import '../styles/room.scss'
import { ConfirmModal } from "../components/ConfirmModal";

type RoomParams = {
    id: string
}

export function AdminRoom() {
    const history = useHistory()
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const [deletingQuestionId, setDeletingQuestionId] = useState('')
    const {questions, title} = useRoom(roomId)
    const [endRoomModalIsOpen, setEndRoomModalIsOpen] = useState(false)
    
    
    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })
        history.push('/')
    }

// TODO Modal de confirmação
    // async function handleDeleteQuestion() {
    //     await database.ref(`rooms/${roomId}/questions/${deletingQuestionId}`).remove()
    //     setDeletingQuestionId('')
    //     setEndRoomModalIsOpen(false);
    // }
    

    async function handleCheckQuestionAsAnswered(questionId:string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true
        });
    }

    async function handleHighlightQuestion(questionId:string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true
        });
    }
    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="logo"/>
                    <div>
                        <RoomCode code={roomId} />
                        <Button cssClass="end-room" isOutlined onClick={()=>setEndRoomModalIsOpen(true)}>Encerrar Sala</Button>
                    </div>
                </div>
            </header>
            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    <div>
                    {
                        questions && <span>{questions.length} perguntas</span>
                    }
                        <Button isOutlined onClick={()=>setEndRoomModalIsOpen(true)}>Encerrar Sala</Button>
                    </div>

                </div>
                
                <div className="question-list">
                {
                    questions.map(question=>(
                        <Question 
                            key={question.id} 
                            content={question.content} 
                            author={question.author}  
                            isAnswered={question.isAnswered}
                            isHighlighted={question.isHighlighted}

                        >
                            {
                                !question.isAnswered&&(
                                    <>
                                       <button
                                            type="button"
                                            onClick={()=>handleCheckQuestionAsAnswered(question.id)}
                                        >
                                            <img src={checkImg} alt="Marcar pergunta como respondida"/>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={()=>handleHighlightQuestion(question.id)}
                                        >
                                            <img src={answerImg} alt="Dar destaque à pergunta"/>
                                        </button>
                                    </>
                                )
                            }
                            <button
                                type="button"
                                onClick={()=>{
                                    
                                    setDeletingQuestionId(question.id);
                                }}
                            >
                                <img src={deleteImg} alt="remover pergunta"/>
                            </button>
                        </Question>
                    ))
                }
                </div>
            </main>

            <ConfirmModal
                modalIsOpen={endRoomModalIsOpen}
                closeModal={()=>setEndRoomModalIsOpen(false)}
            >
                <div className="end-room-modal">
                    <div>
                        <h1>Encerrar sala</h1>
                        <p>Tem certeza que você deseja encerrar esta sala?</p>
                    </div>
                    <div>
                        <button onClick={()=>setEndRoomModalIsOpen(false)}>Cancelar</button>
                        <button onClick={handleEndRoom} >Sim, encerrar</button>
                    </div>
                </div>
            </ConfirmModal>
        </div>
    )
}
