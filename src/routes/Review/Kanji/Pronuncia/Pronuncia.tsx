import { useEffect, useState } from "react";
import '../../study-screen.css'
import randomize from "../../../../randomize";
import { useOutletContext } from 'react-router-dom';
import refresh from '../../../../assets/refresh.png';

export default function Pronuncia(){
    const [timer, setTimer]:                   [number, any] = useState(0); 
    const [question, setQuestion]:             [string, any] = useState('');
    const [answerK, setAnswerK]:               [string, any] = useState('');
    const [answerO, setAnswerO]:               [string, any] = useState('');
    const [configuration, setConfiguration]:   [any, any] = useState({});
    const [questions, setQuestions]:           [string[][], any] = useState([]);
    const [questionNumber, setQuestionNumber]: [number, any] = useState(0);
    const [reset, setReset]:                   [boolean, any] = useState(false);
    const [gameOver, setGameOver]:             [boolean, any] = useState(false);
    const [newReview, setNewReview]:           [boolean, any] = useState(false);

    var interval: number;

    useOutletContext();

    useEffect(() => {
        if(reset) setReset(false)
        setTimer(0);

        if(JSON.stringify(configuration) == '{}'){
            setConfiguration(JSON.parse(localStorage.configuration));
            return;
        }
        
        let new_questions: string[][] = [...newQuestions()];
        let temp_questions: string[][] = [];
        let questions_quantity: number = configuration.questions_at_a_time;


        while(temp_questions.length < questions_quantity && new_questions.length != 0){
            if(new_questions[0] == undefined) new_questions.shift()
            temp_questions.push(new_questions[0]);
            new_questions.shift();
        }

        setTimer(configuration.time_to_answer)
        
        setTimeout(() => {
            setNewReview(false)
            setQuestions(temp_questions);
            setQuestion(temp_questions[questionNumber][0])
            setAnswerK('?')
        }, configuration.answer_rest_delay * 1000);

    },[configuration, reset])
    
    //INICIAR CONTAGEM REGRESSIVA
    useEffect(() => {
        if(JSON.stringify(configuration) == '{}' || JSON.stringify(questions) == '[]') return
        if(newReview) return

        //MOSTRAR RESPOSTA
        if(timer == 0){
            showAnswer();
        }

        //REINICIAR CONTAGEM REGRESSIVA QUANDO CONTADOR CHEGAR A ZERO
        if(timer == 0 - 1){
            setTimer(Number(configuration.time_to_answer));
        }

        //INICIAR NOVO CONTADOR
        else if(timer == configuration.time_to_answer){
            let delay = Number(configuration.answer_rest_delay)

            countDown();
            //QUANDO CONTADOR CHEGAR A 0, AGUARDAR ALGUNS SEGUNDOS ANTES DE REINICIAR
            setTimeout(updateQuestion, (timer + delay) * 1000)

        }
    }, [timer, configuration, questions]);    
    
    //REDUZIR timer EM 1 A CADA SEGUNDO
    const countDown = (): void => {
        let prevTimer: number = timer;
        
        interval = setInterval(() => {
            prevTimer--;

            if(prevTimer >= 0)
                setTimer(prevTimer);
            if(prevTimer == 0) clearInterval(interval);
        },1000)
    }

    const reviewAgain = (): void => {
        setNewReview(true);
        setReset(true);
        setGameOver(false);
    }

    function newQuestions(): ReadonlyArray<Array<string>> {
        let kanji: ReadonlyArray<Array<string>> = randomize(configuration.kanji.kanji_list)
        
        return kanji;
    }

    const updateQuestion = (): void => { 
        setQuestionNumber(questionNumber + 1);
        if(questionNumber + 1 < questions.length){
            setQuestion(questions[questionNumber+1][0])
            setTimer(-1);
            setAnswerK('?');
            setAnswerO('');
        }
        
        //FIM DAS PERGUNTAS
        else{
            setGameOver(true)
            setQuestion('');
            setAnswerK('');
            setAnswerO('');
            setQuestion([]);
            setQuestions([])
            setQuestionNumber(0)
        }
    }

    const showAnswer = (): void => {
        let answer: any = questions[questionNumber];

        if(configuration.kanji.show_kunyomi){}
            setAnswerK(answer[2].kunyomi);
        if(configuration.kanji.show_onyomi)
            setAnswerO(answer[2].onyomi);
    }

    return (
        <div className='study-screen flex'>
            <article className="flex">
                <div>
                    <span>Tempo restante:</span>
                    <span>{timer}</span>
                </div>
                <div>
                    <span>Perguntas restantes:</span>
                    <span>{questions.length - questionNumber || 0}</span>
                </div>
            </article>

            <section className="flex">
                {!gameOver ? (
                    
                    <><div className="flex">
                        <label>{question}</label>
                    </div>
                    <hr />
                    <div className="flex">
                        <label>{answerK}</label>
                        <label>{answerO}</label>
                    </div></>
                    
                ) : (
                        
                    <img src={refresh} className="refresh" onClick={() => reviewAgain()}/>
                    
                )}
                
            </section>
        </div>
    )
}