import { useEffect, useState } from "react";
import '../study-screen.css'
import {hiragana, katakana, Alphabets, KanjiList} from '../../../scripts/data'
import randomize from "../../../scripts/randomize";
import { useOutletContext } from 'react-router-dom';
import refresh from '../../../assets/refresh.png';
import RootContext from "../../../scripts/RootContext";

export default function Pronuncia(){
    //ESTADOS OBTIDO DO root.tsx
    const {
        configuration, 
    }: RootContext = useOutletContext() 

    const [timer, setTimer] =                   useState<number>(0); 
    const [answerRest, setAnswerRest] =         useState<number>(configuration.answer_rest_delay); 
    const [question, setQuestion] =             useState<string>('');
    const [answer, setAnswer] =                 useState<string>('');
    const [questions, setQuestions] =           useState<Alphabets>([]);
    const [questionNumber, setQuestionNumber] = useState<number>(0);
    const [reset, setReset] =                   useState<boolean>(false);
    const [gameOver, setGameOver] =             useState<boolean>(false);
    const [paused, setPaused] =                 useState<boolean>(false);

    const getSelectedAlphabet = (): string => {
        let url = window.location.pathname;
        
        return url.match(/hiragana|katakana/g)?.[0] || 'kanji'
    }     
    
    const alphabet = getSelectedAlphabet();

    useEffect(() => {
        const handlePaused = (e: KeyboardEvent): void => {
            if(e.key == ' ') setPaused(prevPaused => !prevPaused);
        }
        document.addEventListener('keydown', handlePaused);

        return () => document.removeEventListener('keydown', handlePaused);
    }, [])


    useEffect(() => {

        //OBTER QUESTÕES
        let new_questions: Alphabets = newQuestions();
        let questions_quantity: number = configuration.questions_at_a_time;

        // OBTER APENAS OS HIRAGANS E KATAKANAS QUE ESTÃO DENTRO DOS GRUPOS SELECIONADOS PELO USUÁRIO
        if(alphabet != 'kanji'){
            new_questions = new_questions.filter((question: string[] | KanjiList) => 
                configuration[alphabet].sets_to_show.includes(question[2])
            );
        }   
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
        if(gameOver) setTimer(0);
        if(JSON.stringify(questions) == '[]') return;
        if(paused) return;
 
        // REDUZIR TIMER EM 1 A CADA SEGUNDO
        if(timer > 0)
            var tm = setTimeout(() => setTimer(timer - 1), 1000);

        // MOSTRAR RESPOSTA E MANTER ELA VISÍVEL POR ALGUNS SEGUNDOS ANTES DE IR PARA A PRÓXIMA QUESTÃO
        else{
            showAnswer();
            var delay = answerRest;
            var itv = setInterval(() => {
                if(delay == 0){
                    setTimer(configuration.time_to_answer);
                    setAnswerRest(configuration.answer_rest_delay);
                    updateQuestion();
                    clearInterval(itv);
                }
                else{
                    delay--;
                    setAnswerRest(delay);
                }
            }, 1000)
        }

        return () => {clearTimeout(tm); clearInterval(itv)};
    
    },[timer, paused])

    // REALIZAR O REVIEW NOVAMENTE?
    const reviewAgain = (): void => {
        setReset(!reset);
        setGameOver(false);
    }

    // OBTER PERGUNTAS EMBARALHADAS
    const newQuestions = (): Alphabets => {
        if(alphabet == 'hiragana') return randomize(hiragana);
        if(alphabet == 'katakana') return randomize(katakana);
        else                       return randomize(configuration.kanji.kanji_list)
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

    // MOSTRAR RESPOSTAS E INFORMAÇÕES EXTRAS
    const showAnswer = (): void => {
        if(alphabet == 'kanji'){
            setAnswer(
                questions[questionNumber][2].kunyomi + '\n' +
                questions[questionNumber][2].onyomi
            )
        }
        else setAnswer(questions[questionNumber][1])
    }

    const handlePaused = (key: string): void => {
        if(key == ' '){
            setPaused(!paused);
        }
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
                            {question.includes('\n') ? 
                            
                                <>
                                    <label>
                                        {question.slice(0,question.indexOf('\n'))}
                                    </label>
                                    <label>
                                        {question.slice(question.indexOf('\n'))}
                                    </label>
                                </>
                                
                                : <label>{question}</label>

                            }
                        </div>
                        <hr onClick={() => handlePaused(' ')} style={paused ? {outline: '3px solid #777'} : {outline: ''}}/>
                        <div className="flex-center">
                            {answer.includes('\n') ? 
                                
                                <>
                                    <label>
                                        {answer.slice(0,answer.indexOf('\n'))}
                                    </label>
                                    <label>
                                        {answer.slice(answer.indexOf('\n'))}
                                    </label>
                                </>
                                
                                : <label>{answer}</label>

                            }
                        </div>
                        
                    </>
                    
                ) : (
                        
                        <img src={refresh} className="refresh" onClick={() => reviewAgain()}/>
                    
                )}
                
            </section>
        </div>
    )
}