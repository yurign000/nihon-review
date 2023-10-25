import { useEffect, useState } from "react";
import '../../study-screen.css'
import randomize from "../../../../randomize";
import { useOutletContext } from 'react-router-dom';
import refresh from '../../../../assets/refresh.png';

export default function Escrita(){
    const [timer, setTimer]:                   [number, any] = useState(0); 
    const [questionK, setQuestionK]:           [string, any] = useState('');
    const [questionO, setQuestionO]:           [string, any] = useState('');
    const [answer, setAnswer]:                 [string, any] = useState('');
    const [info, setInfo]:                     [string, any] = useState('');
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
        let temp_questions: (string | any)[][] = [];
        let questions_quantity: number = configuration.questions_at_a_time;


        while(temp_questions.length < questions_quantity && new_questions.length != 0){
            if(new_questions[0] == undefined) new_questions.shift();
            temp_questions.push(new_questions[0]);
            new_questions.shift();
        }

        setTimer(configuration.time_to_answer);
        
        setTimeout(() => {
            setNewReview(false);
            setQuestions(temp_questions);
            if(configuration.kanji.show_kunyomi)
                setQuestionK(temp_questions[questionNumber][2].kunyomi);
            if(configuration.kanji.show_onyomi)
                setQuestionO(temp_questions[questionNumber][2].onyomi);
            if(configuration.kanji.show_meaning)
                setInfo(temp_questions[questionNumber][1]);
            setAnswer('?')
            
        }, configuration.answer_rest_delay * 1000);

    },[configuration, reset]);
    
    //INICIAR CONTAGEM REGRESSIVA
    useEffect(() => {
        if(JSON.stringify(configuration) == '{}' || JSON.stringify(questions) == '[]') return;
        if(newReview) return;

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
            let question: any = questions[questionNumber+1]

            if(configuration.kanji.show_kunyomi)
                setQuestionK(question[2].kunyomi);
            if(configuration.kanji.show_onyomi)
                setQuestionO(question[2].onyomi);
            if(configuration.kanji.show_meaning)
                setInfo(question[1]);

            setAnswer('?')
            setTimer(-1);
            setAnswer('?');
        }
        
        //FIM DAS PERGUNTAS
        else{
            setGameOver(true)
            setQuestionK('');
            setAnswer('');
            setAnswer('');
            setInfo('');
            setQuestionK([]);
            setQuestionO([]);
            setQuestions([])
            setQuestionNumber(0)
        }
    }

    const showAnswer = (): void => {
        let answer: any = questions[questionNumber];
        setAnswer(answer[0]);
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
                        <label>{questionK}</label>
                        <label>{questionO}</label>
                        <label className="details">{info != '' ? '(' + info + ')' : ''}</label>
                    </div>
                    <hr />
                    <div className="flex">
                        <label>{answer}</label>
                    </div></>
                    
                ) : (
                        
                    <img src={refresh} className="refresh" onClick={() => reviewAgain()}/>
                    
                )}
                
            </section>
        </div>
    )
}