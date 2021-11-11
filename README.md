# cloud-music

尝试使用 **React + Typescript** 模仿网易云项目

后台 **api** 使用 https://binaryify.github.io/NeteaseCloudMusicApi/#/ ，感谢提供者的贡献



## 1. 路由配置

- 使用 **react-router-config** 进行配置，这种配置形式与 **vue** 极为相似，最后在组件中调取 **renderRoutes** 进行渲染
- **index.tsx**

```tsx
import { RouteConfig } from "react-router-config";
import { Redirect } from 'react-router';
import Home from '../application/Home';
import Recommend from '../application/Recommend';

const routeConfig: RouteConfig[] = [
    {
        path: '/',
        component: Home,
        routes: [
            {
                path: '/',
                exact: true,
                render: () => (
                    <Redirect to={'/recommend'} />   
                )
            },
            {
                path: '/recommend',
                component: Recommend
            }
        ]
    }
]

export default routeConfig;
```



- 在 **routes** 目录下的 **index.tsx** 文件中进行配置的时候，**component** 的类型为 **React.ComponentType** ，所以在每一个导出的组件都需要使用 **react-router** 中的 **withRouter** 方法修饰，另外 **props** 还需继承 **RouteConfigComponentProps**
- **home.tsx**

```tsx
import React from 'react';
import { withRouter } from 'react-router'
import { RouteConfigComponentProps, renderRoutes } from 'react-router-config'

interface HomeProps extends RouteConfigComponentProps {
    name: string;
}

const Home: React.FC<HomeProps> = (props) => {
    const { name, route } = props;
    console.log(name);
    return (
        <div>
            Home
            { renderRoutes(route?.routes) }
        </div>
    )
}

export default withRouter(Home as any);
```





## 2. 轮播与推荐列表

- 轮播使用 **antd** 的 **Carousel** ，**Slider** 组件接收 **BannerList** 和自定义的 **style** ，踩的坑就是记得要在 **App.tsx** 里引入 **antd** 的 **css** 文件
- 推荐列表利用 **space-around** 和 **width: 32%** 达到三列歌单的效果，但是遇到一个坑，在 **desc** 里文本似乎不会自动换行，然后学到了 **css** 的新属性 **word-break: break-all;** 来解决该问题
- 另外因为文本和背景有时候可能都是白色，所以需要设置遮罩来处理

```scss
&::before {
    content: "";
    position: absolute;
    top: 0;
    width: 100%;
    height: 35px;
    border-radius: 5px;
    background: linear-gradient(hsla(0, 0%, 38%, 0.35), hsla(0, 0%, 100%, 0));
}
```







## 3. 封装 Scroll

- 使用 **better-scroll** 组件，分别处理 **scroll** ，**pullDown** 和 **pullUp** 三种事件
- 利用 **useEffect** 对 **bScrool** 进行初始化
- 另外有时候可能需要通过 **ref** 获得该组件的 **DOM** ，因此使用 **forwardRef** 

```tsx
import React, { useEffect, useRef, useState, forwardRef } from 'react';
import BScroll from '@better-scroll/core';
import PullDown from '@better-scroll/pull-down';
import PullUp from '@better-scroll/pull-up';
import ObserveDOM from '@better-scroll/observe-dom'
import { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll';

export interface ScrollInterface {
    onScroll?: Function;
    onPullUp?: Function;
    onPullDown?: Function;
    children?: React.ReactNode;
}

BScroll.use(ObserveDOM);
BScroll.use(PullDown);
BScroll.use(PullUp);

const Scroll = forwardRef<HTMLElement, ScrollInterface>((props, ref) => {
    const {
        onPullUp,
        onScroll,
        onPullDown,
        children
    } = props;

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [scrollObj, setScrollObj] = useState<BScrollConstructor>();
    
    const initScroll = () => {
        const scroll = new BScroll(scrollContainerRef.current as HTMLDivElement, {
            probeType: 3,
            click: true,
            observeDOM: true,
            bounce: {
                top: true,
                bottom: true
            },

            pullDownRefresh: {
                threshold: 70,
                stop: 0
            },

            pullUpLoad: {
                threshold: 90,
                stop: 10
            }
      
        });
        setScrollObj(scroll);
    }

    const pullDown = () => {
        onPullDown && onPullDown();
        setTimeout(() => {
            scrollObj?.finishPullDown();
            scrollObj?.refresh();
        }, 500);
    }

    const pullUp = async () => {
        onPullUp && onPullUp();
        setTimeout(() => {
            scrollObj?.finishPullUp();
            scrollObj?.refresh();
        }, 500);
    }

    useEffect(() => {
        initScroll();
        return () => {
            scrollObj?.destroy();
        }
    }, []);

    useEffect(() => {
        if (!scrollObj || !onScroll) {
            return;
        } else {
            scrollObj.on('scroll', (scroll: Event) => {
                onScroll(scroll);
            });

            return () => {
                scrollObj.off('scroll');
            }
        }
    }, [scrollObj, onScroll]);

    useEffect(() => {
        if (!scrollObj || !pullDown) {
            return;
        } else {
            scrollObj.on('pullingDown', pullDown);
            return () => {
                scrollObj.off('pullingDown');
            }
        }
    }, [scrollObj, onPullDown]);

    useEffect(() => {        
        if (!scrollObj || !pullUp) {
            return;
        } else {
            scrollObj.on('pullingUp', pullUp);
            return () => {
                scrollObj.off('pullingUp');
            }
        }
    }, [scrollObj, onPullUp]);
    

    return (
        <div
            ref={scrollContainerRef}
            style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden'
            }}
        >
            {children}
        </div>
    )
})

export default Scroll;
```





## 4. redux 数据层

- 在每一个 **page** 下面都创建一个 **store**
- **store** 基本都包含以下文件
  1.  **constants.tsx** - **action 的类型**
  2.  **actionCreator.tsx** - **page** 与 **store** 沟通的桥梁
  3.  **types.tsx** - 把 **state** 存储的数据定义单独存放
  4.  **reducer.tsx**  - 获取 **action** ，执行相关逻辑
  5.  **index.tsx** 将主要逻辑梳理导出

- 其中在 **typescript** 中 **constans.tsx** 中的 **action** 类型可以这样书写

```tsx
export const CHANGE_SINGER_LIST = 'singers/CHANGE_SINGER_LIST';
export type CHANGE_SINGER_LIST = typeof CHANGE_SINGER_LIST;

export const CHANGE_PAGE = 'singers/CHANGE_PAGE';
export type CHANGE_PAGE = typeof CHANGE_PAGE;

export const ADD_SINGER_LIST = 'singers/ADD_SINGER_LIST';
export type ADD_SINGER_LIST = typeof ADD_SINGER_LIST;
```



- 在 **actionCreator.tsx** 中 **Dispatch** 可以传入泛型规范

```tsx
export type SingersAction = IChangeSingerListAction | IChangeSingersPageAction | IAddSingerListAction;

export const getSingerList = (singerTag: SingerTagItem, alpha: AlphaItem) => {
    const type = getTypeByTag(singerTag);
    const area = getAreaByTag(singerTag);
    const initial = alpha.name;

    return (dispatch: Dispatch<SingersAction>) => {
        getSingerListRequest(type, area, initial).then(data => {
            console.log('singer list', data.artists);
            dispatch(changeSingerList(data.artists))
        }).catch(err => {
            console.error('error !!!', err);
        })
    }
}
```



- 在调用 **request.tsx** 的时候会因为没有规范 **axios** 而导致 **data.artists** 等出现报错
- 在这里暂时先把 **response** 的数据格式声明也放在 **request.tsx** 中

```tsx
interface IBannerResponse {
    banners: RecommendTypes.BannerItem[];
}

export const getBannerRequest = () => {
    return axiosInstance.get<any, IBannerResponse>('/banner');
}
```



- 利用 **react-redux** 将 **store** 与 **page** 连接
- 但是这里暂时存在一个问题，**mapDispatchToProps** 和 **mapStateToProps** 中的 **dispatch** 和 **state** 只能先定义为 **any** 类型

```tsx
export type RecommendProps = IStateProps & IDispatchProps;

interface IStateProps {
    bannerList: RecommendTypes.BannerItem[];
    recommendList: RecommendTypes.RecommendItem[];
    enterLoading: boolean;
}

interface IDispatchProps {
    getBannerListDispatch: () => void;
    getRecommendListDispatch: () => void;
}

const mapStateToProps = (state: any): IStateProps => {
    return {
        bannerList: state.recommend.bannerList,
        recommendList: state.recommend.recommendList,
        enterLoading: state.recommend.enterLoading
    }
}

const mapDispatchToProps = (dispatch: any): IDispatchProps => {
    return {
        getBannerListDispatch() {
            const action = actionCreators.getBannerList();
            dispatch(action);
        },

        getRecommendListDispatch() {
            const action = actionCreators.getRecommendList();
            dispatch(action);
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Recommend));
```





## 5. 静态数据处理

- 在 **Singers** 页面里有 **热门歌手** 和 **首字母** 两个 **header** ，这部分数据也几乎可以理解为是静态的
- 而根据后台 **api** ，歌手的不同 **类型type** 和 **地区area** 又需要传入不同的 **params** 
- 由此想起实习时候项目对于 **不同类型文件** 与 **icon** 的 **映射处理** ，在 **utils.tsx** 下建立 **map** 维护 **type** 和 **area** 与 **params** 的映射关系
- 再根据 **map.keys()** 动态生成 **热门歌手** 的 **tag**

```tsx
const typeToNumber: { [T: string]: number } = {
    '全部': -1,
    '男歌手': 1,
    '女歌手': 2,
    '乐队': 3
}

const areaToNumber: { [T: string]: number } = {
    '全部': -1,
    '华语': 7,
    '欧美': 96,
    '日本': 8,
    '韩国': 16,
    '其他': 0
}

const tags: SingerTagItem[] = [];
export const getTagList = (): SingerTagItem[] => {
    if (tags.length) {
        return tags;
    } else {
        for (const kType of Object.keys(typeToNumber)) {
            for (const kArea of Object.keys(areaToNumber)) {
                tags.push({
                    name: kType === kArea ? kType : (kArea + kType),
                    area: kArea,
                    type: kType,
                    key: kArea + kType
                })
            }
        }
        return tags;
    }
}


export const getTypeByTag = (tag: SingerTagItem): number => {
    return typeToNumber[tag.type];
}

export const getAreaByTag = (tag: SingerTagItem): number => {
    return areaToNumber[tag.area];
}
```





## 6. HorizenBar

- 对于上面的静态数据处理完后，可以利用前面封装的 **Scroll** 组件对其进行包裹，只不过因为要加上 **active** 等状态，所以在这里再封装一个 **HorizenBar**
- 考虑该组件接受一系列数据 **items** ，有一个 **active** 的 **item** ，有最左侧的 **title** 属性，以及与父组件沟通的 **handleItemClick** 回调函数
- 但是对于 **item** 这一数据却不知道一个明确的结构，在以往做过的组件封装中，如 **Menu** （这一部分可以看另一个 **repository - Flame-Design**）是通过 **context** 直接通信的
- 而这里一开始设计的初步就直接传 **items** 的方式，最初设计一个通用的 **interface HorizenBarProps** ，其中使用 **HorizenBarItem** 来规范

```tsx
interface HorizenBarItem {
    name: string;
    key: string;
}

export interface IHorizenBarProps {
    title: string;
    items: HorizenBarItem[];
    activeItem?: HorizenBarItem;
    handleItemClick: (item: HorizenBarItem) => void;
}
```

- 但是这种方法对于 **items** 和 **activeItem** 是可行的，对于 **handleItemClick** 是不可行的，原因可以参照以下这段代码

```tsx
interface A {
    name: string;
}

interface B {
    name: string;
    age: number;
}

let handleAClick: (a: A) => void;

const handleBClick = (b: B) => {
    console.log(b.age);
}

// 报错
handleAClick = handleBClick;
handleAClick({ name: 'a' });
```

- 原因我没有找到一个合理的解释，但是猜测是在变量赋值中 **interface** 可以做到向下兼容，但是对于 **Function** 里的变量就不是这么一回事了

- 因此需要寻找另外一种方式，对于不清晰的数据结构，容易想到泛型，加上 **HOC** 的设计思想，可以设计一个 **HOC函数 getHorizenBar** 

```tsx
import React from 'react';
import Scroll from '../../components/Scroll';

interface HorizenBarItem {
    name: string;
    key: string;
}

export interface IHorizenBarProps<T> {
    title: string;
    items: T[];
    activeItem?: T;
    handleItemClick: (item: T) => void;
}

const getHorizenBar = <T extends HorizenBarItem>(): React.FC<IHorizenBarProps<T>> => {
    return (props) => {
        const {
            title,
            items,
            activeItem,
            handleItemClick,
        } = props;

        const renderItem = () => {
            return (
                <div className='horizenbar-scroll'>
                    {
                        items.map(item => {
                            const classes = `horizenbar-item ${activeItem?.key === item.key ? 'active' : ''}`;

                            return (
                                <span className={classes} key={item.key} onClick={() => { handleItemClick(item) }}>
                                    {item.name}
                                </span>
                            )
                        })
                    }
                </div>
            )
        }

        return (
            <div className='horizenbar-wrapper'>
                <span className='horizenbar-title'>
                    {title}
                </span>
                <Scroll direction='X'>
                    {renderItem()}
                </Scroll>
            </div>
        )
    }
}

export default getHorizenBar;

```



- 随后可以在 **singers** 中调用

```tsx
    const HorizenBarSinger = getHorizenBar<SingerTagItem>();
    const HorizenBarAlpha = getHorizenBar<AlphaItem>();

    const handleSingerTagClick = (newSingerTag: SingerTagItem) => {
        setSingerTag(newSingerTag);
        getSingerList(newSingerTag, alpha);
        changeSingerPage(1);
    }

    const handleAlphaClick = (newAlpha: AlphaItem) => {
        setAlpha(newAlpha);
        getSingerList(singerTag, newAlpha);
        changeSingerPage(1);
    }

    return (
        <div className='singers-wrapper'>
            <HorizenBarSinger title='热门:' items={singerTagList} activeItem={singerTag} handleItemClick={handleSingerTagClick} />
            <HorizenBarAlpha title='首字母:' items={alphaList} activeItem={alpha} handleItemClick={handleAlphaClick} />
            ...
    )
```



- 想了一下还是使用 **HorizenBar， HorizenBarItem  +  context** 的形式封装好一些，以后再补一下 ... ...



## 7. Rebuild：HorizenBar

- 根据 **SOC关注点分离原则** ，**HorizenBar** 应该只关注于内部横向 **scroll** 以及 **active** 逻辑的实现，不应该对传入的 **item** 有过多限制
- 加上仿照 **H5** 的语义化特点，利用 **Context** 把 **HorizenBar** 重构了一次

- **HorizenBar.tsx**

```tsx
import React, { createContext, CSSProperties, useState } from 'react';
import Scroll from '../Scroll';
import { HorizenBarItemProps } from './horizenBarItem';

export interface HorizenBarProps {
    title?: string
    style?: CSSProperties
    defaultActiveIndex?: string;
    onSelect?: (index: string) => void;
}

export interface IHorizenBarContext {
    activeIndex: string;
    handleItemClick: (index: string) => void;
}

export const HorizenBarContext = createContext<IHorizenBarContext>({
    activeIndex: '',
    handleItemClick: () => { }
})

const HorizenBar: React.FC<HorizenBarProps> = (props) => {
    const {
        title,
        style,
        defaultActiveIndex,
        onSelect,
        children
    } = props;

    const [activeIndex, setActiveIndex] = useState(defaultActiveIndex || '');

    const handleItemClick = (index: string) => {
        onSelect && onSelect(index);
        setActiveIndex(index);
    }

    const renderChildren = () => {
        return React.Children.map(children, (child, i) => {
            const childrenElement = child as React.FunctionComponentElement<HorizenBarItemProps>;
            const index = childrenElement.props.index || i.toString();
            return React.cloneElement(childrenElement, {
                index
            })
        })
    }

    return (
        <div className='horizenbar-wrapper' style={style}>
            {
                title &&
                (
                    <span className='horizenbar-title'>
                        {title}
                    </span>
                )
            }
            <Scroll direction='X'>
                <HorizenBarContext.Provider value={{ activeIndex, handleItemClick }}>
                    <div className='horizenbar-scroll'>
                        {renderChildren()}
                    </div>
                </HorizenBarContext.Provider>
            </Scroll>
        </div>
    )
}

export default HorizenBar;
```



- **HorizenBarItem.tsx**

```tsx
import React, { useContext } from 'react';
import { HorizenBarContext } from './horizenBar';

export interface HorizenBarItemProps {
    index?: string;
}

const HorizenBarItem: React.FC<HorizenBarItemProps> = (props) => {
    const {
        index,
        children
    } = props;

    const horizenBarContext = useContext(HorizenBarContext);
    const classes = `horizenbar-item ${horizenBarContext.activeIndex === index ? 'active' : ''}`

    const handleItemClick = () => {
        horizenBarContext.handleItemClick(index || '');
    }

    return (
        <div className={classes} onClick={handleItemClick}>
            {children}
        </div>
    )
}

HorizenBarItem.displayName = 'HorizenBarItem';
export default HorizenBarItem;
```



- 然后在 **index.tsx** 中对组件进行整合

```tsx
import React from 'react';
import HorizenBar, { HorizenBarProps } from './horizenBar';
import HorizenBarItem, { HorizenBarItemProps } from './horizenBarItem';

export type IHorizenComponent = React.FC<HorizenBarProps> & {
    Item: React.FC<HorizenBarItemProps>
}

const HorizenBarComponent = HorizenBar as IHorizenComponent;
HorizenBarComponent.Item = HorizenBarItem

export default HorizenBarComponent;
```



- 应用在 **singers.tsx** 中

```tsx
<HorizenBarComponent title='热门：'>
    {
        singerTagList.map((singerTag, index) => (
            <HorizenBarComponent.Item key={index}>
                {singerTag.name}
            </HorizenBarComponent.Item>
        ))
    }
</HorizenBarComponent>
<HorizenBarComponent title='首字母：'>
    {
        alphaList.map((alpha, index) => (
            <HorizenBarComponent.Item key={index}>
                {alpha.name}
            </HorizenBarComponent.Item>
        ))
    }
</HorizenBarComponent>
```

## 8. IntersectionObserver

- 之前的图片懒加载一直都是使用 **window.innerHeight** 等 **api** 来实现，但其实浏览器里面有一个 **IntersectionObserver** 对象也可以帮助实时监测对象是否处于可视范围内
- 利用 **hooks** 的特性，设计一个 **useIntersectionObserver** ，传入一个 **DOM** 的 **ref** 对象和 **option** ，**option** 里面有一个 **onIntersect** 的回调函数，当监听元素可见的时候会执行该回调函数

```tsx
import React, { useEffect } from 'react';

interface IIntersectionOption {
    onIntersect: IntersectionObserverCallback;
    thresold?: number;
    rootMargin?: string;
}

export const useIntersectionObserver = (ref: React.RefObject<HTMLElement | HTMLImageElement>, option: IIntersectionOption) => {
    useEffect(() => {
        const observer = new IntersectionObserver(option.onIntersect, {
            ...option
        });
        const current = ref.current;
        if (current) {
            observer.observe(current);
        }
        return () => {
            if (current)
                observer.unobserve(current);
        }
    })
}

export default useIntersectionObserver;
```



- 然后利用该 **hooks** 解决图片懒加载以及加载卡顿的情况
- 定义两个状态 **isVisible** 和 **isLoaded** ，分别是图片是否可见和是否加载成功
- 然后利用 **useIntersectionObserver** 对图片 **ref** 对象进行监听，当可见时执行 **setIsVisible(true)** ，然后取消订阅
- 另外还要在 **img** 标签中注册 **onLoaded** 的事件监听，只有成功加载的时候，才完整显示图片

```tsx
import React, { CSSProperties, ImgHTMLAttributes, useRef, useState } from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import Icon from '../Icon';
import Loading from '../Loading';

export interface ImageLoaderProps extends ImgHTMLAttributes<HTMLImageElement> {
    className?: string
    style?: CSSProperties
}

const ImageLoader: React.FC<ImageLoaderProps> = (props) => {
    const { className, style, ...restProps } = props;
    const [isVisible, setIsVisible] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

    useIntersectionObserver(imgRef, {
        onIntersect: (entries, observerElement) => {
            if (entries[0].isIntersecting) {
                setIsVisible(true);
                observerElement.unobserve(imgRef.current!);
            }
        }
    })

    return (
        <div ref={imgRef}>
            {
                isVisible && <img
                    alt='img'
                    className={className}
                    onLoad={() => { setIsLoaded(true) }}
                    style={{
                        ...style,
                        display: `${isLoaded ? '' : 'none'}`
                    }}
                    {...restProps}
                />
            }
            {
                (isVisible && !isLoaded) &&
                <Loading className={className} />
            }
        </div>
    )
}

export default ImageLoader;
```





## 9. animation & 路由跳转

- 在处理完首页的三个 **page** 后，继续完成点击某个 **Album** 进入 **playlist** 的工作
- 对应的路由为 **recommend/:id** ，处于 **Recommend** 组件之下

```tsx
import { RouteConfig } from "react-router-config";
import { Redirect } from 'react-router';
import Home from '../application/Home';
import Recommend from '../application/Recommend';
import Singers from '../application/Singers';
import Rank from '../application/Rank';
import Album from '../application/Album';

const routeConfig: RouteConfig[] = [
    {
        path: '/',
        component: Home,
        routes: [
        	... ...
            {
                path: '/recommend',
                component: Recommend,
                routes: [
                    {
                        path: '/recommend/:id',
                        component: Album
                    }
                ]
            },
        ]
    }
]

export default routeConfig;
```



- 对于 **Album** 组件的渲染可以在 **Recommend** 组件下添加 **renderRoutes** 实现

```tsx
<div className='recommend-wrapper'>
    {enterLoading ? <Loading style={{ height: '100%' }} /> : renderRecommend()}
    {renderRoutes(props.route?.routes)}
</div>
```



- **Album** 页面的编写不再赘述，主要重点是对于切入切出动画的处理，利用 **react-transition-group** 可以轻易实现
- 但是在切换的过程中不会引起路由的变化，所以需要在动画结束后的钩子函数 **onExited** 中执行 **props.history.goback()** 主动返回

```tsx
<CSSTransition
    in={showStatus}
    timeout={300}
    appear={true}
    unmountOnExit
    classNames='fly'
    onExited={props.history.goBack}
    >
    <div className='album-wrapper'>
        <Header ref={headerRef} title={playList.name} isMarquee={isMarquee} handleBack={() => { setShowStatus(false) }} />
        <div className='album-content'>
            <Scroll onScroll={handleScroll}>
                {renderDesc()}
                {renderSongList()}
            </Scroll>
        </div>
    </div>
</CSSTransition>
```





## 10. Marquee Header

- 在旧版本的 **HTML** 标签中有 **\<marquee\>** 这个标签实现跑马灯的效果，但是现在已经废弃了
- 因此在 **Header** 组件中可以自己去实现一个这样的效果，用 **div** 包裹一层 **span** ，然后添加动画从 **left: 100%** 位移到 **left: -100%** 

```scss
.header-marquee {
    width: 100%;
    height: 100%;
    margin-left: 40px;
    overflow: hidden;
    position: relative;
    padding-top: 0;

    & > span {
        line-height: 40px;
        font-size: 20px;
        top: 0;
        color: white;
        position: absolute;
        animation: marquee 10s linear infinite;
    }
}

@keyframes marquee {
    from {
        left: 100%;
    }

    to {
        left: -100%;
    }
}
```



- 另外该效果应该在用户向下滑动的时候才逐步呈现，此时可以利用封装好的 **Scroll** 组件中的 **onScroll** 钩子函数进行实现
- 通过回调函数的 **pos** 来主动控制 **Header** 的背景透明度以及 **marquee** 动画效果
- 还有一个关键的点是需要直接操作 **DOM** 元素的 **style** ，因此 **Header** 不能是 **FC** 组件，需要通过 **forwardRef** 来对 **ref** 进行转发

```tsx
const handleScroll = (pos: any) => {
    const minScrollY = -40;
    const percent = Math.abs(pos.y / minScrollY);
    const headerDOM = headerRef.current!;
    console.log(pos, percent);
    if (pos.y < minScrollY) {
        headerDOM.style.backgroundColor = '#e74c3c';
        headerDOM.style.opacity = Math.min(1, (percent - 1) / 2).toString();
        setIsMarquee(true);

    } else {
        headerDOM.style.backgroundColor = '';
        headerDOM.style.opacity = '1';
        setIsMarquee(false);
    }
}
```



## 11. 路由Params

- 处理 **Album** 组件还有另外一个问题，因为 **url** 中有 **id** 这个动态属性，获取该信息的手段有两种，一种是利用 **hooks** 中的 **useParms** ，另外是使用 **props.match.params** ，后者的使用前提是该组件被 **withRouter** 函数处理过
- 在这里因为 **Header** 已经使用了 **props.history** 等 **api** 了，为了保持一致性，所以使用上述方法的后者
- 但是这里 **withRouter** 方法的泛型处理有一些麻烦，先看定义

```tsx
export function withRouter<P extends RouteComponentProps<any>, C extends React.ComponentType<P>>(
    component: C & React.ComponentType<P>,
): React.ComponentClass<Omit<P, keyof RouteComponentProps<any>> & WithRouterProps<C>> & WithRouterStatics<C>;

export interface RouteComponentProps<
    Params extends { [K in keyof Params]?: string } = {},
    C extends StaticContext = StaticContext,
    S = H.LocationState
> {
    history: H.History<S>;
    location: H.Location<S>;
    match: match<Params>;
    staticContext?: C | undefined;
}
```



- **withRouter** 需要接收两个泛型参数，一个约定有关 **route** 的信息，另外一个约束组件
- 而 **RouteComponentProps** 中泛型接收三个，在这里我们需要定义第一个 **Parmas** ，也就是 **url** 中的参数
- 所以最容易想到的做法就是第一个泛型传入 **RouteComponentProps\<AlbumUrlParmas\>** ，然后第二个传入 **React.FC\<AlbumProps\>**
- 但是这里会报错，因为 **withRouter** 的定义中 `withRouter<P extends RouteComponentProps<any>, C extends React.ComponentType<P>>` C 需要继承以 P 为 **props** 的 **React.ComponentType** ，在这里组件显然不继承于 **React.Component<RouteComponentProps\<AlbumUrlParmas\>>** 
- 解决方法就是直接定义 **AlbumProps** 继承于 **RouteComponentProps\<AlbumUrlParmas\>** ，然后在 **withRouter** 的第一个泛型参数中直接传入 **AlbumProps** 

```tsx
interface AlbumUrlParms {
    id: string
}

interface AlbumProps extends RouteComponentProps<AlbumUrlParmas> {}
    
export default withRouter<AlbumProps, React.FC<AlbumProps>>(Album);
```



- 但是还没有完成定义，因为当前这个 **AlbumProps** 不可扩展了，后面与 **redux** 配合使用的时候，还有很多存在于 **props** 的数据
- 解决方法是定义完 **store** 中的数据结构后，使用 **type** 关键字进行联合
- 最后还有因为使用了 **react-router-config** 这个库，所以需要把 **RouteComponentProps** 更换为 **RouteConfigComponentProps**

```tsx
interface AlbumUrlParms {
    id: string
}

export type AlbumProps = RouteConfigComponentProps<AlbumUrlParms> & IStateProps & IDispatchProps;

interface IStateProps {
    playList: AlbumTypes.PlayListItem
}

interface IDispatchProps {
    getPlaylist: (id: string) => void
}


export default withRouter<AlbumProps, React.FC<AlbumProps>>(connect(mapStateToProps, mapDispatchToProps)(Album));
```



## 12. 音乐播放

- 根据 **Player** 的使用场景分为了 **mini** 和 **normal** 两个版本，基本的布局和 **redux** 数据管理这里不再赘述
- 最重要的主要是控制音乐的播放，涉及 **\<audio\>** 标签，首先明确一点就是关于 **音乐** 的管理都是放在最上层 **Player** 组件管理的
- 关于音乐播放需要维护 **当前时间currentTime** ，**音乐时长duration** ，**百分比percent** ，**播放列表playList** 

```tsx
const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);
const percent = currentTime / duration * 100;

useEffect(() => {
    if (!sequencePlayList || sequencePlayList.length === 0)
        return;
    handleSongChange(0);
}, [sequencePlayList])

const handleSongChange = (index: number) => {
    const song = playList[index];
    audioRef.current!.src = getSongUrl(song.id);  // 设置 src
    setCurrentTime(0);                            // 当前时间为0
    setCurrentSong(song);                         // 设置当前歌曲
    setCurrentIndex(index);                       // 设置当前索引
    setDuration(song.dt / 1000 | 0);              // 设置音乐时长
    if (playing) {
        setTimeout(() => {                        // 进行音乐播放
            audioRef.current!.play();
        });
    }
}
```



- 两个子组件 **miniPlayer** 和 **normalPlayer** 根据 **percent** 等信息展示歌曲信息
- 处理播放模式的切换：**单曲循环** ，**顺序播放** 和 **乱序播放** 。这里可以使用 **策略模式** 避免过多 **if else** 语句

```tsx
const modeStrategies = {
    'loop': function () {
        setPlayMode('loop');
        setPlayList(currentSong ? [currentSong] : []);
    },

    'random': function () {
        setPlayMode('random')
        const newPlayList = shuffleList<PlayerTypes.Song>(sequencePlayList);  // 打乱playList
        console.log(newPlayList, sequencePlayList);
        setPlayList(newPlayList);
        for (let i = 0; i < newPlayList.length; i++) {      // 更新index
            if (newPlayList[i].id === currentSong?.id) {
                setCurrentIndex(i);
                break;
            }
        }
    },

    'sequence': function () {
        setPlayMode('sequence')
        setPlayList(sequencePlayList);
        for (let i = 0; i < sequencePlayList.length; i++) {
            if (sequencePlayList[i].id === currentSong?.id) {
                setCurrentIndex(i);
                break;
            }
        }
    }
}

const handleModeChange = (newMode: playMode) => {
    console.log('mode change', newMode);
    const strategy = modeStrategies[newMode];
    strategy();
    if (playing) {
        setTimeout(() => {
            audioRef.current!.play();
        });
    }
}
```



- 其中打乱playList的函数 **shuffleList** 放在 **utils.tsx** 里

```tsx
export function shuffleList<T>(list: T[]): T[] {
    const len = list.length;
    const resList = list.slice();
    for (let i = 0; i < len; i++) {
        const x = (Math.random() * len) | 0;
        const y = (Math.random() * len) | 0;
        const temp = resList[x];
        resList[x] = resList[y];
        resList[y] = temp;
    }
    return resList;
}
```



- 然后是处理歌曲播放结束后下一首继续播放，以及播放过程中实时更新 **currentTime** 的逻辑，会触发 **\<audio\>** 的 **onEnded** 和 **onTimeUpdate**  事件

```tsx
const handleNextSong = () => {
    const newIndex = (currentIndex + 1) % playList.length;
    handleSongChange(newIndex);
}

const handleTimeUpdate = (e: any) => {
    setCurrentTime(e.target.currentTime);
}

<audio
    ref={audioRef}
    onTimeUpdate={handleTimeUpdate}
    onEnded={() => { handleNextSong() }}
/>
```



## 13. ProgressBar

- 前面音乐播放的逻辑还有一部分没有讲到，那就是 **normalPlayer** 里面的进度条逻辑
- 分别有两个 **div** 表示 **outter** 和 **inner** 进度，然后添加一个 **div** 放在 **inner** 的最右侧呈现进度条按钮，这样便可以在更新 **inner-div** 的 **width** 的时候实现进度条自动更新的效果

```tsx
<div className='progress-bar-wrapper' onClick={handleProgressBarClick}>
    <div className='progress-bar-outer' ref={progressOuterRef}></div>
    <div className='progress-bar-inner' ref={progressInnerRef}>
        <div className='progress-bar-btn' onTouchMove={handleTouchMove} />
    </div>
</div>
```



- 然后完成用户拖动进度条逻辑，会触发 **onTouchMove** 事件
- 另外需要知道 **整个进度条宽度progressBarWidth** ，**进度条最左侧X坐标initialPosX** ，这个可以通过 **ref** 获取 **DOM** ，调用 **getBoundingClientRect** 

```tsx
useEffect(() => {
    initialPosX.current = progressInnerRef.current!.getBoundingClientRect().x;  // 最左侧横坐标
    progressBarWidth.current = progressOuterRef.current!.getBoundingClientRect().width;  // 进度条宽度
    if (percentage) {
        progressInnerRef.current!.style.width = `${Math.min(100, percentage)}%`;  // inner进度条宽度
    }
}, [percentage])
```



- 然后在 **handleTouchMove** 函数中获得最新拖动位置的横坐标，然后更新 **inner-div** 的百分比宽度
- 另外因为进度条百分比改变了，这个时候也要通知上层组件，因此调用回调函数 **percentageChange** ，这样在 **NormalPlayer** 组件里就可以改变当前音乐的播放进度

```tsx
// 上层 Player 传入的回调函数
const handleCurrentTimeChange = (newTime: number) => {
    setCurrentTime(newTime);
    audioRef.current!.currentTime = newTime;
    if (playing) {
        setTimeout(() => {
            audioRef.current!.play();
        });
    }
}

// 上层 NormalPlayer 传入的回调函数
const handleProgressChange = (percent: number) => {
    const newTime = duration * percent / 100;
    handleCurrentTimeChange(newTime);
}

const updateProgressBar = (posX: number) => {
    const initialX = initialPosX.current;  // 进度条最左侧横坐标
    const width = progressBarWidth.current;  // 进度条宽度
    const newPercentage = Math.min((posX - initialX) / width * 100, 100);  // 计算百分比
    progressInnerRef.current!.style.width = `${newPercentage}%`;  // 更新 width
    percentageChange && percentageChange(newPercentage);  // 调用回调函数
}

const handleTouchMove = (e: React.TouchEvent) => {
    const posX = e.touches[0].pageX;  // 获取最新横坐标
    updateProgressBar(posX);  // 更新inner width
}
```



- 至于用户点击改变进度的逻辑基本一致

```tsx
const handleProgressBarClick = (e: React.MouseEvent) => {
    const posX = e.pageX;
    updateProgressBar(posX);
}
```



