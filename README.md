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

