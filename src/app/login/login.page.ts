import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import axios from 'axios';

// import { AccessProviders } from '../Providers/access-providers';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = "";
  password: string = "";

  disabledButton;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    //private accProv: AccessProvider,
    private storage: Storage,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  async presentToast(a) {
    const toast = await this.toastCtrl.create({
      message: a,
      duration: 1500
    });
    toast.present();
  }


  async trylogin() {
    if (this.email == "") {
      this.presentToast('Isi Email Anda');
    } else if (this.password = "") {
      this.presentToast('Isis Password Anda');
    }
    this.disabledButton = true;
    const loader = await this.loadingCtrl.create({
      message: 'Silahkan Tunggu...',
    });
    loader.present();

    const fd = new FormData();
    fd.append('email', this.email);
    fd.append('password', this.password);

    try {
      const res = await axios.post('http://localhost:8080/wp-pegawai/api/login/', fd);
      console.log(res.data.result);
      if (res.data.error == false) {
        loader.dismiss();
        this.disabledButton = false;
        this.presentToast('Login Sukses');
        this.storage.set('isLoggedIn', res.data.result);
        localStorage.setItem('isLoggedIn', res.data.result);
        this.navCtrl.navigateRoot(['/tabs/tab1/']);
      } else {
        this.presentToast(res.data.result.message);
      }

    } catch (err) {
      loader.dismiss();
      this.presentToast('Telah terjadi sesuatu');
    }
  }
}
