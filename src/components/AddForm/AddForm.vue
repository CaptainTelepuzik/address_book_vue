<template src="./template.html"/>

<script>
import SourceService from "@/services/SourceService";
import {AuthHelpers} from "@/helpers/AuthHelpers";
import notification from "@/components/Notifications/Notification";
export default {
  components: {notification},
  name: "AddForm",
  data() {
    return {
      surname: "",
      name: "",
      telephone: "",
      email: "",
      source: new SourceService({endpoint: 'Contact'}),
      messages: []
    }
  },
  beforeMount() {
    this.source.create().then((result) => {
      if (result.success) {
        this.contacts = {...result.data};
      }
    });
  },
  methods: {
    submit() {
      const rec = {
        ...this.contacts, contact_name: this.name, user_id: AuthHelpers.getUser(), contact_surname: this.surname,
        telephone:this.telephone, email: this.email
      };
      this.source.update(rec).then((result) => {
        let timeStamp = Date.now().toLocaleString();
        if (result.success) {
          this.surname = '';
          this.name = '';
          this.telephone = "";
          this.email = "";
          this.$emit('submit');
          this.messages.unshift({name: 'Контакт добавлен', id:timeStamp});
          setTimeout(() => {
            const newMessage = [];
            this.messages.forEach((message) => {
              if (message.id !== timeStamp) {
                newMessage.push(message)
              }

              this.messages = newMessage
            })
          }, 3000)
        }
      });
    },
  },
}
</script>

<style scoped src="./style.less" lang="less">
</style>