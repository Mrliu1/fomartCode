import React from 'react';
import ReactDOM from 'react-dom';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import { formatMessage } from 'umi/locale';
import SiderMenu from '@/components/SiderMenu';
import Authorized from '@/utils/Authorized';
import SettingDrawer from '@/components/SettingDrawer';
import withRouter from 'umi/withRouter';
// import logo from '../assets/logo.svg';
import webioLogo from '../../public/webio-logo.png';
import searchLogo from '../../public/search-logo.png';

import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import Exception403 from '../pages/Exception/403';

const { Content } = Layout;

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  console.log(data, parentAuthority, parentName, '格式化一')
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }

      const result = {
        ...item,
        name: formatMessage({ id: locale, defaultMessage: item.name }),
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};
@connect(({ loading, user }) => ({
  ...user,
  submitting: loading.effects['user/fetchCurrent'],
}))
class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.getBreadcrumbNameMap = memoizeOne(this.getBreadcrumbNameMap, isEqual);
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
  }

  state = {
    rendering: true,
    isMobile: false,
    menuData: [],
  };

  componentWillMount() {
    const {
      dispatch,
      match: { url },
    } = this.props;
    dispatch({
      type: 'views/fetch',
    });
    // dispatch({
    //   type: 'views/changeurl',
    //   payload: url,
    // });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'setting/getSetting',
    });
    this.renderRef = requestAnimationFrame(() => {
      this.setState({
        rendering: false,
      });
    });
    this.enquireHandler = enquireScreen(mobile => {
      const { isMobile } = this.state;
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile,
        });
      }
    });
  }

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    const { isMobile } = this.state;
    const { collapsed } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.renderRef);
    unenquireScreen(this.enquireHandler);
  }

  getContext() {
    const { location } = this.props;
    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap,
    };
  }

  getMenuData() {
    const {
      datas,
      route: { routes },
    } = this.props;
    const newRoutes = [...datas, ...routes];
    return memoizeOneFormatter(Array.from([...newRoutes]));
  }

  /**
   * 获取面包屑映射
   * @param {Object} menuData 菜单配置
   */
  getBreadcrumbNameMap() {
    const routerMap = {};
    const mergeMenuAndRouter = data => {
      data.forEach(menuItem => {
        if (menuItem.children) {
          mergeMenuAndRouter(menuItem.children);
        }
        routerMap[menuItem.path] = menuItem;
      });
    };
    mergeMenuAndRouter(this.getMenuData());
    return routerMap;
  }

  drawCanvas = (name, phoneEnding) => {
    const id = 'divCanvas';
    if (document.getElementById(id) !== null) {
      document.body.removeChild(document.getElementById(id));
    }
    // const {
    //   currentUser: { name, phoneEnding },
    // } = this.props;
    // console.log(this.props,name, phoneEnding,'name, phoneEnding')
    let canvasDom = document.createElement('canvas');
    //设置画布的长宽
    canvasDom.width = 240;
    canvasDom.height = 150;
    const drawCanvasDivDom = document.createElement('div');
    drawCanvasDivDom.setAttribute('id', id)
    drawCanvasDivDom.style.position = 'fixed';
    drawCanvasDivDom.style.top = 0;
    drawCanvasDivDom.style.left = 0;
    drawCanvasDivDom.style.zIndex = 1000;
    drawCanvasDivDom.style.pointerEvents = 'none';
    drawCanvasDivDom.style.width = '100vw';
    drawCanvasDivDom.style.height = '100vh';
    let ctx = canvasDom.getContext('2d');
    ctx.rotate((30 * Math.PI) / 180);
    ctx.globalAlpha = 0.2;
    ctx.fillText(`${name}${phoneEnding}`, parseFloat(100) / 2, parseFloat(150) / 2);
    const base64Url = canvasDom.toDataURL();
    drawCanvasDivDom.style.backgroundRepeat = 'repeat';
    drawCanvasDivDom.style.backgroundImage = `url(${base64Url})`;
    document.body.appendChild(drawCanvasDivDom);
    return id
  };

  drawCanvasSet = (name, phoneEnding) => {
    let id = this.drawCanvas(name, phoneEnding)
    let number = 0
    name = this.props.currentUser.name
     setInterval(() => {
    if (document.getElementById(id) === null || !name) {
        number = number +1 
        if (number > 4) {
          name = 'user'
        }
        id = this.drawCanvas(name, phoneEnding);
      }
    }, 500);
    window.onresize = () => {
     this.drawCanvas(name, phoneEnding);
    }
  }

  matchParamsPath = pathname => {
    const pathKey = Object.keys(this.breadcrumbNameMap).find(key =>
      pathToRegexp(key).test(pathname)
    );
    return this.breadcrumbNameMap[pathKey];
  };

  getPageTitle = pathname => {
    const currRouterData = this.matchParamsPath(pathname);

    if (!currRouterData) {
      return 'iCarbonX';
    }
    const message = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });
    return `${message} - iCarbonX`;
  };

  getLayoutStyle = () => {
    const { isMobile } = this.state;
    const { fixSiderbar, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  getContentStyle = () => {
    const { fixedHeader } = this.props;
    return {
      position: 'relative',
      margin: '24px 24px 0',
      paddingTop: fixedHeader ? 64 : 0,
    };
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  renderSettingDrawer() {
    const { rendering } = this.state;
    if ((rendering || process.env.NODE_ENV === 'production') && APP_TYPE !== 'site') {
      return null;
    }
    return <SettingDrawer />;
  }

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      currentUser: { systemId, name, phoneEnding },
      location: { pathname },
    } = this.props;
    this.drawCanvasSet(name, phoneEnding);
    const logo = systemId === 'lims_webio' ? webioLogo : searchLogo;
    const title = systemId === 'lims_webio' ? 'LIMS' : 'LIMS';
    const { isMobile } = this.state;
    const menuData = this.getMenuData();
    const isTop = PropsLayout === 'topmenu';
    const routerConfig = this.matchParamsPath(pathname);
    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <SiderMenu
            logo={logo}
            titleMsg={title}
            Authorized={Authorized}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            {...this.props}
          />
        )}
           
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            {...this.props}
          />

          <Content style={this.getContentStyle()}>
            <Authorized
              authority={routerConfig && routerConfig.authority}
              noMatch={<Exception403 />}
            >
              {children}
            </Authorized>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
        {this.renderSettingDrawer()}
      </React.Fragment>
    );
  }
}

export default withRouter(
  connect(({ global, user, setting, views }) => ({
    collapsed: global.collapsed,
    currentUser: user.currentUser,
    layout: setting.layout,
    ...setting,
    ...views,
  }))(BasicLayout)
);
