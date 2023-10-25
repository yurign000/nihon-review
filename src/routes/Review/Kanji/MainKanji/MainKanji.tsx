import { useEffect } from 'react';
import modo_de_estudo from '../../../../assets/modo-de-estudo.png';
import modo_de_estudo_dark from '../../../../assets/modo-de-estudo-dark.png';
import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import playSound from '../../../../manageSounds';

export default function MainKanji(){

    const [changeTheme,setChangeTheme, setChangedURL]: [boolean, any, any] = useOutletContext() //ESTADO OBTIDO DO root.jsx

    setChangeTheme; //EVITAR WARNING

    //VERIFICAR SE MODO DARK ESTÁ ATIVO
    useEffect(() => {
        if(localStorage.configuration){
            let configuration: any = JSON.parse(localStorage.configuration);

            handleDarkTheme(configuration)
        }
    }, [changeTheme])

    //DEFINIR MODO DARK
    const handleDarkTheme = (configuration: any): void => {
        if(configuration.theme == 'dark'){
            let title_img: NodeListOf<Element> = document.querySelectorAll('figure img');

            title_img.forEach(e => {
                let img: any = e;
                img.src = modo_de_estudo_dark
            })
        }
    }   

    return (
        <div className="main flex">
            <section className='flex'>
                <figure className='flex'>
                    <img src={modo_de_estudo} alt="titulo - modo de estudo" />
                </figure>

                <article className='flex'>
                    <div className='flex'>
                        <Link className='text-hover' to='/review/kanji/pronuncia' onClick={() => {setChangedURL(true); playSound('change-page')}}>
                            <span className='text-shadow'>PRONUNCIA</span>
                            <i className='box-shadow'></i>
                        </Link>
                    </div>
                    <div className='flex'>
                        <Link className='text-hover' to='/review/kanji/escrita' onClick={() => {setChangedURL(true); playSound('change-page')}}>
                            <span className='text-shadow'>ESCRITA</span>
                            <i className='box-shadow'></i>
                        </Link>
                    </div>
                    <div className='flex'>
                        <Link className='text-hover' to='/review/kanji/significado' onClick={() => {setChangedURL(true); playSound('change-page')}}>
                            <span className='text-shadow'>SIGNIFICADO</span>
                            <i className='box-shadow'></i>
                        </Link>
                    </div>
                </article>
            </section>
        </div>
    )
}