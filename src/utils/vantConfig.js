import { Image as VanImage,Button,NavBar,Col, Row,DropdownMenu, DropdownItem, Popup ,
  ShareSheet,Toast,Loading ,Swipe, SwipeItem,Lazyload,List,ImagePreview 
} from 'vant'
import 'vant/lib/index.css'

export default (app) => {
  app.use(VanImage)
  app.use(Button)
  app.use(NavBar)
  app.use(Col)
  app.use(Row)
  app.use(DropdownMenu);
  app.use(DropdownItem);
  app.use(Popup);
  app.use(ShareSheet);
  app.use(Toast );
  app.use(Loading  );
  app.use(Swipe);
  app.use(SwipeItem);
  app.use(Lazyload );
  app.use(List);
  app.use(ImagePreview );
}
