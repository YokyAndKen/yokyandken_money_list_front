<template>
  <div>表格页</div>
  <div class="org_table">
    <div class="table_title">组织档案</div>

    <!-- 第一页 -->
    <div class="flex pic_warpper_container">
      <div style="flex: 1">
        <div class="line flex" >
          <div class="name">组织<br>名称</div>
          <div class="unit" style="flex: 1">{{detail.orgin_name}}</div>
        </div>
        <div class="line flex">
          <div class="name">成立<br>时间</div>
          <div class="unit" style="width: 180px;">{{detail.found_date}}</div>
          <div class="name1">实际办公<br>地址</div>
          <div class="unit" style="flex: 1">{{detail.office_address}}</div>
        </div>
        <div class="line flex">
          <div class="name">组织<br>负责人</div>
          <div class="unit" style="width: 180px;">{{detail.organizer}}</div>
          <div class="name1">负责人证<br>件及号码</div>
          <div class="unit" style="flex: 1">{{detail.papers_num}}</div>
        </div>
        <div class="line flex">
          <div class="name">国家或<br>地区</div>
          <div class="unit" style="width: 180px;">{{detail.country_area}}</div>
          <div class="name1" style="line-height: 49px;">境外背景</div>
          <div class="unit" style="flex: 1">{{detail.outbound_bgc}}</div>
        </div>
      </div>
        <!-- 照片 -->
      <div class="photo">{{detail.photo}}</div>

    </div>

    <div class="line flex">
      <div class="name">组织所<br>属类别</div>
      <div class="unit" style="width: 180px;">{{detail.organ_type}}</div>
      <div class="name1" style="line-height: 49px;">主管单位</div>
      <div class="unit" style="flex: 1">{{detail.governor_unit}}</div>
    </div>

    <div class="line flex" >
      <div class="name">所属公<br>安分局</div>
      <div class="unit" style="width: 180px;">{{detail.public_security}}</div>
      <div class="name1">所属<br>派出所</div>
      <div class="unit" style="flex: 1">{{detail.police_station}}</div>
    </div>

    <div class="line flex" >
      <div class="name">组织<br>网站</div>
      <div class="unit" style="flex: 1">{{detail.organ_web}}</div>
    </div>

    <div class="line flex" >
      <div class="name">官方<br>电话</div>
      <div class="unit" style="width: 250px;">{{detail.official_phone}}</div>
      <div class="name1">官方<br>邮箱</div>
      <div class="unit" style="flex: 1">{{detail.official_mail}}</div>
    </div>
    
    <div class="line flex" style="height: 70px;">
      <div class="name">其他通<br>联/官<br>宣渠道</div>
      <div class="unit" style="flex: 1">{{detail.open_announce}}</div>
    </div>

    <!-- 组织基本信息 -->
    <div class="bdl1 flex bdb1 bdr1">
      <div class="name">组织<br>基本<br>信息</div>
      <div style="flex: 1;">
        <div style="width: 100%;" class="bdb1 flex bdl1">
          <div class="name">组织<br>规模<br>简介</div>
          <div class="unit" style="flex: 1;min-height: 120px;">{{detail.scale_brief}}</div>
        </div>
        <div style="width: 100%;" class="bdb1 flex bdl1">
          <div class="name">组织总<br>部、分部及<br>关联组织<br>情况</div>
          <div class="unit" style="flex: 1;min-height: 150px;">{{detail.all_orgin_case}}</div>
        </div>
        <div style="width: 100%;" class=" flex bdl1">
          <div class="name">组织<br>所涉<br>核心<br>领域</div>
          <div class="unit" style="flex: 1;min-height: 150px;">{{detail.core_area}}</div>
        </div>
      </div>
    </div>



    <!-- 第二页 -->
    <br><br>
    <div class="bdt1 bdl1 bdr1 page2_line">组织负责人1（与目标对象档案对应）</div>
    <div class="flex bdt1 bdl1">
      <div style="width: 50%;" class="flex">
        <div class="page2_name">中文名</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.one_china_name}}</div>
      </div>
      <div style="width: 50%;" class="flex">
        <div class="page2_name">英文名</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.one_english_name}}</div>
      </div>
    </div>
    <div class="flex bdt1 bdl1">
      <div style="width: 50%;" class="flex">
        <div class="page2_name">性别</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.one_sex}}</div>
      </div>
      <div style="width: 50%;" class="flex">
        <div class="page2_name">出生日期</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.one_birth_date}}</div>
      </div>
    </div>
    <div class="flex bdt1 bdl1">
      <div style="width: 50%;" class="flex">
        <div class="page2_name">国籍</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.one_nationality}}</div>
      </div>
      <div style="width: 50%;" class="flex">
        <div class="page2_name">所在组织职务</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.one_post}}</div>
      </div>
    </div>
    <div class="flex bdt1 bdl1">
      <div style="width: 50%;" class="flex">
        <div class="page2_name">证件类型</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.one_papers_type}}</div>
      </div>
      <div style="width: 50%;" class="flex">
        <div class="page2_name">证件号码</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.one_papers_num}}</div>
      </div>
    </div>
    <div class="flex bdt1 bdl1">
      <div style="width: 50%;" class="flex">
        <div class="page2_name">手机号码</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.one_phone_num}}</div>
      </div>
      <div style="width: 50%;" class="flex">
        <div class="page2_name">微信号码</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.one_vx_num}}</div>
      </div>
    </div>
    <div class="bdt1 bdl1 bdr1 page2_line">组织负责人2（与目标对象档案对应）</div>
    <div class="flex bdt1 bdl1">
      <div style="width: 50%;" class="flex">
        <div class="page2_name">{{detail.two_china_name}}</div>
        <div class="bdr1 unit" style="flex: 1"></div>
      </div>
      <div style="width: 50%;" class="flex">
        <div class="page2_name">英文名</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.two_english_name}}</div>
      </div>
    </div>
    <div class="flex bdt1 bdl1">
      <div style="width: 50%;" class="flex">
        <div class="page2_name">性别</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.two_sex}}</div>
      </div>
      <div style="width: 50%;" class="flex">
        <div class="page2_name">出生日期</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.two_birth_date}}</div>
      </div>
    </div>
    <div class="flex bdt1 bdl1">
      <div style="width: 50%;" class="flex">
        <div class="page2_name">国籍</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.two_nationality}}</div>
      </div>
      <div style="width: 50%;" class="flex">
        <div class="page2_name">所在组织职务</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.two_post}}</div>
      </div>
    </div>
    <div class="flex bdt1 bdl1">
      <div style="width: 50%;" class="flex">
        <div class="page2_name">证件类型</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.two_papers_type}}</div>
      </div>
      <div style="width: 50%;" class="flex">
        <div class="page2_name">证件号码</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.two_papers_num}}</div>
      </div>
    </div>
    <div class="flex bdt1 bdl1">
      <div style="width: 50%;" class="flex">
        <div class="page2_name">手机号码</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.two_phone_num}}</div>
      </div>
      <div style="width: 50%;" class="flex">
        <div class="page2_name">微信号码</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.two_vx_num}}</div>
      </div>
    </div>
    <div class="bdt1 bdl1 bdr1 page2_line">组织主要成员1（与目标对象档案对应）</div>
    <div class="flex bdt1 bdl1">
      <div style="width: 50%;" class="flex">
        <div class="page2_name">中文名</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_one_china_name}}</div>
      </div>
      <div style="width: 50%;" class="flex">
        <div class="page2_name">英文名</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_one_english_name}}</div>
      </div>
    </div>
    <div class="flex bdt1 bdl1">
      <div style="width: 50%;" class="flex">
        <div class="page2_name">性别</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_one_sex}}</div>
      </div>
      <div style="width: 50%;" class="flex">
        <div class="page2_name">出生日期</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_one_birth_date}}</div>
      </div>
    </div>
    <div class="flex bdt1 bdl1">
      <div style="width: 50%;" class="flex">
        <div class="page2_name">国籍</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_one_nationality}}</div>
      </div>
      <div style="width: 50%;" class="flex">
        <div class="page2_name">所在组织职务</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_one_post}}</div>
      </div>
    </div>
    <div class="flex bdt1 bdl1">
      <div style="width: 50%;" class="flex">
        <div class="page2_name">证件类型</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_one_papers_type}}</div>
      </div>
      <div style="width: 50%;" class="flex">
        <div class="page2_name">证件号码</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_one_papers_num}}</div>
      </div>
    </div>
    <div class="flex bdt1 bdl1">
      <div style="width: 50%;" class="flex">
        <div class="page2_name">手机号码</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_one_phone_num}}</div>
      </div>
      <div style="width: 50%;" class="flex">
        <div class="page2_name">微信号码</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_one_vx_num}}</div>
      </div>
    </div>
    <div class="bdt1 bdl1 bdr1 page2_line">组织主要成员2（与目标对象档案对应）</div>
    <div class="flex bdt1 bdl1">
      <div style="width: 50%;" class="flex">
        <div class="page2_name">中文名</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_two_china_name}}</div>
      </div>
      <div style="width: 50%;" class="flex">
        <div class="page2_name">英文名</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_two_english_name}}</div>
      </div>
    </div>
    <div class="flex bdt1 bdl1">
      <div style="width: 50%;" class="flex">
        <div class="page2_name">性别</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_two_sex}}</div>
      </div>
      <div style="width: 50%;" class="flex">
        <div class="page2_name">出生日期</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_two_birth_date}}</div>
      </div>
    </div>
    <div class="flex bdt1 bdl1">
      <div style="width: 50%;" class="flex">
        <div class="page2_name">国籍</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_two_nationality}}</div>
      </div>
      <div style="width: 50%;" class="flex">
        <div class="page2_name">所在组织职务</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_two_post}}</div>
      </div>
    </div>
    <div class="flex bdt1 bdl1">
      <div style="width: 50%;" class="flex">
        <div class="page2_name">证件类型</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_two_papers_type}}</div>
      </div>
      <div style="width: 50%;" class="flex">
        <div class="page2_name">证件号码</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_two_papers_num}}</div>
      </div>
    </div>
    <div class="flex bdt1 bdl1">
      <div style="width: 50%;" class="flex">
        <div class="page2_name">手机号码</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_two_phone_num}}</div>
      </div>
      <div style="width: 50%;" class="flex">
        <div class="page2_name">微信号码</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_two_vx_num}}</div>
      </div>
    </div>
    <div class="bdt1 bdl1 bdr1 page2_line">组织主要成员3（与目标对象档案对应）</div>
    <div class="flex bdt1 bdl1">
      <div style="width: 50%;" class="flex">
        <div class="page2_name">中文名</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_three_china_name}}</div>
      </div>
      <div style="width: 50%;" class="flex">
        <div class="page2_name">英文名</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_three_english_name}}</div>
      </div>
    </div>
    <div class="flex bdt1 bdl1">
      <div style="width: 50%;" class="flex">
        <div class="page2_name">性别</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_three_sex}}</div>
      </div>
      <div style="width: 50%;" class="flex">
        <div class="page2_name">出生日期</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_three_birth_date}}</div>
      </div>
    </div>
    <div class="flex bdt1 bdl1">
      <div style="width: 50%;" class="flex">
        <div class="page2_name">国籍</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_three_nationality}}</div>
      </div>
      <div style="width: 50%;" class="flex">
        <div class="page2_name">所在组织职务</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_three_post}}</div>
      </div>
    </div>
    <div class="flex bdt1 bdl1">
      <div style="width: 50%;" class="flex">
        <div class="page2_name">证件类型</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_three_papers_type}}</div>
      </div>
      <div style="width: 50%;" class="flex">
        <div class="page2_name">证件号码</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_three_papers_num}}</div>
      </div>
    </div>
    <div class="flex bdt1 bdl1 bdb1">
      <div style="width: 50%;" class="flex">
        <div class="page2_name">手机号码</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_three_phone_num}}</div>
      </div>
      <div style="width: 50%;" class="flex">
        <div class="page2_name">微信号码</div>
        <div class="bdr1 unit" style="flex: 1">{{detail.person_three_vx_num}}</div>
      </div>
    </div>


    <!-- 第三页 -->
    <br><br>
    <div class="page3_title bdt1 bdl1 bdr1">其他主要成员信息</div>
    <div class="page3_content bdt1 bdl1 bdb1 bdr1">{{detail.key_person}}</div>


    <!-- 第四页 -->
    <br><br>
    <div class="page3_title bdt1 bdl1 bdr1">组织财务资金情况</div>
    <div class="page3_content bdt1 bdl1 bdb1 bdr1">{{detail.fund_case}}</div>


    <!-- 第五页 -->
    <br><br>
    <div class="page3_title bdt1 bdl1 bdr1">组织历史发展主要事件简述</div>
    <div class="page3_content bdt1 bdl1 bdb1 bdr1">{{detail.description_brief}}</div>


    <!-- 第六页 -->
    <br><br>
    <div class="page3_title bdt1 bdl1 bdr1">涉及$$事件情况详情</div>
    <div class="page3_content bdt1 bdl1 bdb1 bdr1">{{detail.event_detail}}</div>


    <!-- 第七页 -->
    <br><br>
    <div class="page3_title bdt1 bdl1 bdr1">组织发布的涉华言论</div>
    <div class="page3_content bdt1 bdl1 bdb1 bdr1">{{detail.remark_china}}</div>


    <!-- 第八页 -->
    <br><br>
    <div class="page3_title bdt1 bdl1 bdr1">涉及违法犯罪情况详情</div>
    <div class="page3_content bdt1 bdl1 bdb1 bdr1">{{detail.criminal_activity}}</div>


    <!-- 第九页 -->
    <br><br>
    <div class="page3_title bdt1 bdl1 bdr1">涉及诉讼情况</div>
    <div class="page3_content bdt1 bdl1 bdb1 bdr1">{{detail.lawsuit}}</div>


    <!-- 第十页 -->
    <br><br>
    <div class="page3_title bdt1 bdl1 bdr1">##措施针对该组织开展工作情况</div>
    <div class="page3_content bdt1 bdl1 bdb1 bdr1">{{detail.out_work}}</div>


    <!-- 第十一页 -->
    <br><br>
    <div class="page3_title bdt1 bdl1 bdr1">其他情况</div>
    <div class="page3_content bdt1 bdl1 bdb1 bdr1">{{detail.other_case}}</div>


    <!-- 第十二页 -->
    <br><br>
    <div class="lastpage_title">填写说明</div>
    <div class="lastpage_word">1、采取“应采尽采、应填尽填”原则；</div>
    <div class="lastpage_word">2、必填项必须填写，非必填项，如没有内容，填写“无”；</div>
    <div class="lastpage_word">3、填写时，先将表格内的解释等文字删除再填写。</div>


  </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, onBeforeUnmount, watch } from "vue";
import detail from '@/views/table.json'

</script>




<style scoped lang='scss'>
.org_table {
  width: 800px;
  margin: 0 auto;
  background: #fff;height: 800px;overflow-y: scroll;
}
.table_title {
  margin-top: 20px;margin-bottom: 20px;
  font-size: 28px;font-weight: bold;
  width: 100%;text-align: center;
}
.pic_warpper_container {
  height: 200px;
  border: 1px solid #000;border-bottom: 0px;border-left: 0px;
}
.photo {
  width: 150px;border-bottom: 1px solid #000;
}
.line {
  border-bottom: 1px solid #000;border-left: 1px solid #000;
  height: 49px;
}
.name {
  width: 60px;height: 100%;display: flex;
  font-size: 18px;line-height: 24px;text-align: center;
  margin: auto 0;align-items: center;justify-content: center;
}
.name1 {
  width: 100px;height: 100%;display: inline-block;
  font-size: 18px;line-height: 24px;text-align: center;
}
.unit {
  border-right: 1px solid #000;border-left: 1px solid #000;height: 100%;padding-left: 3px;
  display: flex;font-size: 18px;align-items: center;line-height: 24px;
}
.name_left_container{
  border-left: 1px solid #000;
}
.page2_line {
  height: 40px;display: flex;justify-content: center;align-items: center;font-size: 18px;
}
.page2_name {
  height: 40px;display: flex;justify-content: center;align-items: center;font-size: 18px;
  width: 130px;
}
.page3_title {
  height: 49px;display: flex;justify-content: center;align-items: center;font-size: 20px;
}
.page3_content {
  min-height: 1180px;font-size: 18px;line-height: 24px;padding-left: 3px;
}
.lastpage_title {
  height: 60px;display: flex;justify-content: center;align-items: center;font-size: 24px;
}
.lastpage_word {
  height: 40px;font-size: 20px;
}

.bdl1{
  border-left: 1px solid #000;
}

.bdr1{
  border-right: 1px solid #000;
}

.bdt1{
  border-top: 1px solid #000;
}

.bdb1{
  border-bottom: 1px solid #000;
}
</style>