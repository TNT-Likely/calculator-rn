import {
  Button,
  Form,
  Input,
  Picker,
  Provider,
  Radio,
  Flex as Row,
  Switch,
  Tabs,
  View,
  Flex,
} from '@ant-design/react-native';
import React, {useEffect} from 'react';
import Select from '@/components/Select';
import {SafeAreaView, ScrollView, Text} from 'react-native';
import {StyleSheet} from 'react-native';
import {calculateLoanRepayment} from '@/utils/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 8,
  },
  submit: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: '100%',
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 12,
  },
  title: {
    width: '40%',
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    lineHeight: 42,
  },
  tabs: {
    backgroundColor: 'transparent',
    flex: 1,
  },
});

const FormExample: React.FC = () => {
  const [form] = Form.useForm();

  const navigation = useNavigation();
  const loanAmount = parseInt(Form.useWatch('loanAmount', form)) ?? 0;
  const accumulatTotalPirce =
    parseInt(Form.useWatch('accumulatTotalPirce', form)) ?? 0;
  const commerceTotalPirce =
    parseInt(Form.useWatch('commerceTotalPirce', form)) ?? 0;

  const typeValue = Form.useWatch('type', form);
  const type = typeof typeValue !== 'string' ? typeValue?.key : typeValue;

  const onSubmit = async () => {
    const params = await form.validateFields();

    let {
      commerceLoanYear = 0,
      accumulatFundYear = 0,
      accumulatFundRate = 0,
      accumulatTotalPirce = 0,
      loanAmount = 0,
      commerceTotalPirce = 0,
      commerceLoanRate = 0,
    } = params;

    const res = await calculateLoanRepayment(type === '3' ? parseFloat(loanAmount) : parseFloat(accumulatTotalPirce), accumulatFundRate, accumulatFundYear,  type === '2' ? parseFloat(loanAmount) : parseFloat(commerceTotalPirce),commerceLoanRate,commerceLoanYear)

    await AsyncStorage.setItem('result', JSON.stringify(res));

    navigation.navigate('Details');
  };

  const handleChange = (isCChange?: boolean) => {
    if (isCChange) {
      form.setFieldValue(
        'accumulatTotalPirce',
        String(loanAmount - commerceTotalPirce),
      );
    } else {
      form.setFieldValue(
        'commerceTotalPirce',
        String(loanAmount - accumulatTotalPirce),
      );
    }
  };

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <Form
            name="basic"
            form={form}
            labelStyle={{
              width: 100,
            }}
            initialValues={{
              loanAmount: '100',
              type: '1',
              accumulatTotalPirce: '50',
              accumulatFundYear: 30,
              accumulatFundRate: '3.25',
              commerceTotalPirce: '50',
              commerceLoanYear: 30,
              commerceLoanRate: '4.2',
            }}>
            <Form.Item
              name="loanAmount"
              label="贷款金额"
              extra={<Text>万</Text>}>
              <Input onBlur={() => handleChange()} />
            </Form.Item>
            <View style={styles.flex}>
              <Text style={styles.title}>贷款方式</Text>
              <Form.Item noStyle name="type" valuePropName="page">
                <Tabs
                  tabs={[
                    {title: '组合贷', key: '1'},
                    {title: '商业贷', key: '2'},
                    {title: '公积金贷', key: '3'},
                  ]}
                  tabBarBackgroundColor={'transparent'}
                  tabBarUnderlineStyle={{
                    width: 60,
                  }}
                />
              </Form.Item>
            </View>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, curValues) =>
                prevValues.type !== curValues.type
              }>
              {({getFieldValue}) => {
                const type =
                  getFieldValue('type')?.key ?? getFieldValue('type');
                const showGJJ = ['1', '3'].includes(type);
                const showSY = ['1', '2'].includes(type);

                return (
                  <>
                    {showGJJ ? (
                      <>
                        {type !== '3' && (
                          <Form.Item
                            label="公积金金额"
                            name="accumulatTotalPirce"
                            extra={<Text>万</Text>}>
                            <Input onBlur={() => handleChange()} />
                          </Form.Item>
                        )}
                        <Form.Item label="公积金年限" name="accumulatFundYear">
                          <Select
                            data={new Array(30).fill(' ').map((_, index) => ({
                              label: `${index + 1}年`,
                              value: index + 1,
                            }))}
                          />
                        </Form.Item>
                        <Form.Item label="公积金利率" name="accumulatFundRate">
                          <Select
                            data={[
                              {
                                label: '3.25%（最新基准利率1倍）',
                                value: '3.25',
                              },
                              {
                                label: '3.58%（最新基准利率1倍）',
                                value: '3.58',
                              },
                              {label: '3.9%（最新基准利率1倍）', value: '3.9'},
                            ]}
                          />
                        </Form.Item>
                      </>
                    ) : null}

                    {showSY && (
                      <>
                        {type !== '2' && (
                          <Form.Item
                            label="商贷金额"
                            name="commerceTotalPirce"
                            extra={<Text>万</Text>}>
                            <Input onBlur={() => handleChange(true)} />
                          </Form.Item>
                        )}
                        <Form.Item label="商贷年限" name="commerceLoanYear">
                          <Select
                            data={new Array(30).fill(' ').map((_, index) => ({
                              label: `${index + 1}年`,
                              value: index + 1,
                            }))}
                          />
                        </Form.Item>
                        <Form.Item
                          label="商贷利率"
                          name="commerceLoanRate"
                          extra={<Text>%</Text>}>
                          <Input />
                        </Form.Item>
                      </>
                    )}
                  </>
                );
              }}
            </Form.Item>
          </Form>
        </ScrollView>
        <View style={styles.submit}>
          <Button type="primary" onPress={onSubmit}>
            开始计算
          </Button>
        </View>
      </SafeAreaView>
    </Provider>
  );
};

export default FormExample;
