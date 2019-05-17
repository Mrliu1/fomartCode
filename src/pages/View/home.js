import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';

import styles from './children.less';

import { Card, Button } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import { TransitionGroup, CSSTransition } from 'react-transition-group';

/* eslint react/no-multi-comp:0 */
@connect(({ views, loading }) => ({
  views,
  loading: loading.models.views,
  urlValues: '',
}))
class HomeView extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      iframeHeight: '70vh',
    };
  }
  componentDidMount() {
    const {
      dispatch,
      views: { urlDatas},
      match: { url },
    } = this.props;
    const payload = {
      urlDatas,
      url,
    }
    dispatch({
      type: 'views/changeurl',
      payload: payload,
    });
  }

  render() {
    const {
      // views: { urlValues },
      loading,
      match: { url },
      views: { urlDatas, urlValues},
      location,
    } = this.props;
    // let urlValues = '';
    // if (urlDatas[url].url.indexOf('https://') != -1) {
    //   window.open(urlDatas[url].url);
    // } else {
    //   if (urlDatas[url].url.indexOf('lims-ui') !== -1) {
    //     urlValues = urlDatas ? `https://boss.icarbonx.com${urlDatas[url].url}` : '';
    //   } else {
    //     urlValues = urlDatas ? `https://boss.icarbonx.com/bosssample${urlDatas[url].url}` : '';
    //   }
    // }
    console.log(urlValues, 'urlValues');
    return (
      <PageHeaderWrapper>
        <div className={styles.newCard} aa="33">
          <iframe
            src={urlValues}
            frameBorder="no"
            border="0"
            allowtransparency="yes"
            style={{ height: '70vh', width: '100%', overflow: 'visible' }}
            height="70vh"
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default HomeView;
