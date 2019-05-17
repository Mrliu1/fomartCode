import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Upload, Select, Button, Icon } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
import GeographicView from './GeographicView';
import PhoneView from './PhoneView';
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }) => (
  <Fragment>
    <div className={styles.avatar_title}>
      <FormattedMessage id="app.settings.basic.avatar" defaultMessage="Avatar" />
    </div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload fileList={[]}>
      <div className={styles.button_view}>
        <Button icon="upload">
          <FormattedMessage id="app.settings.basic.change-avatar" defaultMessage="Change avatar" />
        </Button>
      </div>
    </Upload>
  </Fragment>
);

const validatorGeographic = (rule, value, callback) => {
  const { province, city } = value;
  if (!province.key) {
    callback('Please input your province!');
  }
  if (!city.key) {
    callback('Please input your city!');
  }
  callback();
};

const validatorPhone = (rule, value, callback) => {
  const values = value.split('-');
  if (!values[0]) {
    callback('Please input your area code!');
  }
  if (!values[1]) {
    callback('Please input your phone number!');
  }
  callback();
};


@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
@Form.create()
class BaseView extends Component {
  componentDidMount() {
    this.setBaseInfo();
  }
  state = {
    confirmDirty: false,
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = currentUser[key] || null;
      form.setFieldsValue(obj);
    });
  };

  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser.avatar) {
      return currentUser.avatar;
    }
    const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    return url;
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('new-pwd')) {
      //Two passwords that you enter is inconsistent!
      callback('两个密码不一致！');
    } else {
      callback();
    }
  }
  validateToNextPassword = (rule, value, callback) => {
   const form = this.props.form;
   if (value && this.state.confirmDirty) {
     form.validateFields(['renew-pwd'], { force: true });
   }
   callback();
 }
 isEye = (event) => {
   console.log(event)
 }
  getViewDom = ref => {
    this.view = ref;
  };
  handleSubmit = e => {
    if (e) {
      e.preventDefault();
    }
    const { currentUser, dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      let params = {
        newPassword: values['new-pwd'],
        oldPassword: values['old-pwd'],
      }
      this.props.dispatch({
        type: 'user/putPwd',
        payload: {
          email: currentUser.username,
          // email: 'zhangya@icarbonx.com',
          dto: params,
        },
      });
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const suffix = <Icon type="eye" onClick={this.isEye} />;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
            <FormItem label={formatMessage({ id: 'app.settings.basic.nickname' })}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.nickname-message' }, {}),
                  },
                ],
              })(<Input disabled />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.old-pwd' })}>
              {getFieldDecorator('old-pwd', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.old-pwd-message' }, {}),
                  },
                ],
              })(
                <Input.Password
                  visibilityToggle="true"
                  type="password"
                  placeholder={formatMessage({ id: 'app.settings.basic.old-pwd' })}
                />
              )}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.new-pwd' })}>
              {getFieldDecorator('new-pwd', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.new-pwd-message' }, {}),
                  },
                  {
                    validator: this.validateToNextPassword
                  },
                ],
              })(
                <Input.Password
                  visibilityToggle="true"
                  type="password"
                  placeholder={formatMessage({ id: 'app.settings.basic.new-pwd' })}
                />
              )}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.renew-pwd' })}>
              {getFieldDecorator('renew-pwd', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.renew-pwd-message' }, {}),
                  },
                  { validator: this.compareToFirstPassword },
                ],
              })(
                <Input.Password
                  visibilityToggle="true"
                  type="password"
                  onBlur={this.handleConfirmBlur}
                  placeholder={formatMessage({ id: 'app.settings.basic.renew-pwd' })}
                />
              )}
            </FormItem>
            <Button type="primary" htmlType="submit">
              <FormattedMessage
                id="app.settings.basic.updatepwd"
                defaultMessage="Update password"
              />
            </Button>
          </Form>
        </div>

      </div>
    );
  }
}

export default BaseView;
