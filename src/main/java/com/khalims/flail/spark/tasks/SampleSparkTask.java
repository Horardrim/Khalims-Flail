package com.khalims.flail.spark.tasks;

import java.util.Arrays;

import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.JavaSparkContext;

import scala.Tuple2;

public class SampleSparkTask {
    public static void main(String[] args) {
        // 创建Spark配置
        SparkConf conf = new SparkConf().setAppName("SampleSparkTask").setMaster("local[*]");
        
        // 创建Spark上下文
        try (JavaSparkContext sc = new JavaSparkContext(conf)) {
            
            // 加载数据
            JavaRDD<String> lines = sc.textFile("resources/WordCount.txt");

            // 分割单词并映射为(key, value)形式
            JavaPairRDD<String, Integer> wordCounts =
                lines.flatMap(s -> Arrays.asList(s.split("\\s+")).iterator())
                    .mapToPair(word -> new Tuple2<>(word.toLowerCase(), 1))
                    .reduceByKey((a, b) -> a + b);

            // 收集结果并打印
            for (Tuple2<?, ?> tuple : wordCounts.collect()) {
                System.out.println(tuple._1() + ": " + tuple._2());
            }
        }
    }
}
