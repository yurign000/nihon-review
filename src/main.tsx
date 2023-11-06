import ReactDOM from 'react-dom/client'
import './index.css'
import './global.css'
import { createBrowserRouter, RouterProvider} from "react-router-dom";

// PÁGINAS
import Root from './routes/Root/Root';
import MainPage from './routes/MainPage/MainPage';
import Review from './routes/Review/Review';
import MainHiragana from './routes/Review/MainLearn/MainHiragana';
import MainKatakana from './routes/Review/MainLearn/MainKatakana';
import MainKanji from './routes/Review/MainLearn/MainKanji';
import Escrita from './routes/Review/Modes/Escrita';
import Pronuncia from './routes/Review/Modes/Pronuncia';
import Significado from './routes/Review/Modes/Significado';

const router = createBrowserRouter([
  {
    path: "/", element: <Root/>,
    children: [
      {
        path: "/", element: <MainPage/>,
      },
      {
        path: "review", element: <Review/>,
        children: [
          {path: "hiragana",           element: <MainHiragana></MainHiragana>},
          {path: "hiragana/pronuncia", element: <Pronuncia></Pronuncia>},
          {path: "hiragana/escrita",   element: <Escrita></Escrita>},

          {path: "katakana",           element: <MainKatakana></MainKatakana>},
          {path: "katakana/pronuncia", element: <Pronuncia></Pronuncia>},
          {path: "katakana/escrita",   element: <Escrita></Escrita>},

          {path: "kanji",              element: <MainKanji></MainKanji>},
          {path: "kanji/pronuncia",    element: <Pronuncia></Pronuncia>},
          {path: "kanji/escrita",      element: <Escrita></Escrita>},
          {path: "kanji/significado",  element: <Significado></Significado>},
        ]
      },
    ],
  },
  {
    path: '*', element: <h1>Página não encontrada</h1>
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
