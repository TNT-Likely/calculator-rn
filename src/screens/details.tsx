import {View, Text, Button, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {ActivityIndicator, Tabs} from '@ant-design/react-native';

const styles = StyleSheet.create({
  line: {
    display: 'flex',
    flexDirection: 'row',
  },
  item: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  info: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    color: '#000',
  },
});

type PayDetail = {
  payment: string;
};

function DetailsScreen({navigation}) {
  const [list, setList] = useState<PayDetail[]>([]);
  const [fundList, setFundList] = useState<PayDetail[]>([]);
  const [result, setResult] = useState<any>({});

  const parseStorage = async () => {
    const result = JSON.parse(await AsyncStorage.getItem('result'));

    setList(result.equalInstallment.paymentSchedule);
    setFundList(result.equalPrincipal.paymentSchedule);
    setResult(result);
  };

  useEffect(() => {
    parseStorage();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <ActivityIndicator
        animating={list.length === 0}
        size="large"
        text="加载中..."
        styles={{
          margin: 'auto',
        }}
      />

      {list.length > 0 && (
        <>
          <View style={styles.info}>
            <Text style={styles.infoTitle}>等额本息总利息</Text>
            <Text style={styles.infoTitle}>
              {(result?.equalInstallment?.totalInterest / 10000).toFixed(2)}万元
            </Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.infoTitle}>等额本金总利息</Text>
            <Text style={styles.infoTitle}>
              {(result?.equalPrincipal?.totalInterest / 10000).toFixed(2)}万元
            </Text>
          </View>
          <Text style={{...styles.info, ...styles.infoTitle}}>还款细则</Text>
          <View style={styles.line}>
            <Text style={styles.item}></Text>
            <Text style={styles.item}>等额本息（元）</Text>
            <Text style={styles.item}>等额本金（元）</Text>
          </View>
          {list.map((val, index) => {
            return (
              <View style={styles.line} key={index}>
                <Text style={styles.item}>第{index + 1}期</Text>
                <Text style={styles.item}>{val.payment}</Text>
                <Text style={styles.item}>{fundList[index]?.payment}</Text>
              </View>
            );
          })}
        </>
      )}
    </ScrollView>
  );
}

export default DetailsScreen;
