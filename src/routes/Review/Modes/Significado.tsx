import { useEffect, useState } from "react";
import '../study-screen.css'
import randomize from "../../../scripts/randomize";
import { useOutletContext } from 'react-router-dom';
import refresh from '../../../assets/refresh.png';
import { KanjiList } from "../../../scripts/data";
import RootContext from "../../../scripts/RootContext";

export default function Significado(){
    const [timer, setTimer] =                   useState<number>(0); 
    const [question, setQuestion] =             useState<string>('');
    const [answer, setAnswer] =                 useState<string>('');
    const [questions, setQuestions] =           useState<KanjiList[]>([]);
    const [questionNumber, setQuestionNumber] = useState<number>(0);
    const [reset, setReset] =                   useState<boolean>(false);
    const [gameOver, setGameOver] =             useState<boolean>(false);

    //ESTADOS OBTIDO DO root.tsx
    const {
        configuration, 
    }: RootContext= useOutletContext() 

    useEffect(() => {

        //OBTER QUESTÕES
        let new_questions: KanjiList[] = randomize(configuration.kanji.kanji_list);
        let questions_quantity: number = configuration.questions_at_a_time;

        // OBTER APENAS A QUANTIDADE DE PERGUNTAS QUE O USUÁRIO SELECIONOU
        while(new_questions.length > questions_quantity)
            new_questions.pop();
        
        //INICIAR REVIEW APOS ALGUNS SEGUNDOS
        setTimeout(() => {
            setQuestion(new_questions[questionNumber][0])
            setAnswer('?')
            setQuestions(new_questions);
            setTimer(configuration.time_to_answer)
        }, configuration.answer_rest_delay * 1000);

    },[configuration, reset])
    
    //COMEÇAR AS QUESTÕES
    useEffect(() => {
        if(gameOver) setTimer(0)
        if(JSON.stringify(questions) == '[]') return

        // MOSTRAR RESPOSTA E MANTER ELA VISÍVEL POR ALGUNS SEGUNDOS ANTES DE IR PARA A PRÓXIMA QUESTÃO
        if(timer == 0){
            showAnswer();

            setTimeout(() => {
                updateQuestion();
                setTimer(configuration.time_to_answer);               
                
            }, configuration.answer_rest_delay * 1000);   
        }
 
        // REDUZIR TIMER EM 1 A CADA SEGUNDO
        if(timer > 0)
            setTimeout(() => setTimer(timer - 1), 1000);
    
    },[timer])

    // REALIZAR O REVIEW NOVAMENTE?
    const reviewAgain = (): void => {
        setReset(!reset);
        setGameOver(false);
    }

    // MOTRAR NOVA QUESTÃO 
    const updateQuestion = (): void => { 
        setQuestionNumber(questionNumber + 1);
       
        // VERIFICAR SE AINDA EXISTEM QUESTÕES
        if(questionNumber + 1 < questions.length){
            setQuestion(questions[questionNumber+1][0])
            setAnswer('?');
        }
        
        //FIM DAS PERGUNTAS
        else resetQuestions()
    }

    // APAGAR TODAS AS QUESTÕES
    const resetQuestions = (): void => {
        setGameOver(true)
        setQuestion('');
        setAnswer('');
        setQuestion('');
        setQuestions([]);
        setQuestionNumber(0)
    }

    // MOSTRAR RESPOSTAS
    const showAnswer = (): void => {
        setAnswer(questions[questionNumber][1]);
    }

    return (
        <div className='study-screen flex-center'>
            <article className="flex-center">
                <div>
                    <span>Tempo restante:</span>
                    <span>{timer}</span>
                </div>
                <div>
                    <span>Perguntas restantes:</span>
                    <span>{questions.length - questionNumber || 0}</span>
                </div>
            </article>

            <section className="flex-center">
                {!gameOver ? (
                    
                    <>
                        <div className="flex-center">
                            <label>{question}</label>
                        </div>
                        <hr />
                        <div className="flex-center">
                            <label>{answer}</label>
                        </div>
                    </>
                    
                ) : (
                        
                        <img src={refresh} className="refresh" onClick={() => reviewAgain()}/>
                    
                )}
                
            </section>
        </div>
    )
}