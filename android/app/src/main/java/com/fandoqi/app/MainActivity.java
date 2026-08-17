package com.fandoqi.app;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import android.webkit.WebChromeClient;
import android.view.View;
import android.os.Build;
import android.webkit.ValueCallback;
import android.content.Intent;
import android.net.Uri;

/**
 * MainActivity — فندوقی آفلاین برای اندروید 🌰
 * WebView که فایل‌های لوکال www/index.html را لود می‌کند
 * کاملا آفلاین، بدون نیاز به اینترنت
 */
public class MainActivity extends Activity {

    private WebView webView;
    private ValueCallback<Uri[]> filePathCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setDatabaseEnabled(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);

        // برای اندروید 5+ : Mixed content
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // همه لینک‌های داخلی را داخل WebView نگه دار
                if (url.startsWith("file://") || url.startsWith("data:") || url.contains("fandoqi") || !url.startsWith("http")) {
                    return false;
                }
                // لینک خارجی را در مرورگر باز کن
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                    return true;
                } catch (Exception e) {
                    return false;
                }
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                // inject viewport fix for kids
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            // برای آپلود فایل اگر نیاز شد (آینده)
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
                MainActivity.this.filePathCallback = filePathCallback;
                return true;
            }
        });

        // لود کردن اپ آفلاین از assets
        webView.loadUrl("file:///android_asset/www/index.html");

        // جلوگیری از چشمک
        webView.setBackgroundColor(0xFFFFF6EA);
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            // اگر مودال باز است، اول آن را ببند (با JS)
            webView.evaluateJavascript(
                "(function(){var m=document.querySelectorAll('.modal-backdrop:not(.is-hidden)');if(m.length){m.forEach(function(b){b.classList.add('is-hidden')});return true;}return false;})()",
                new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {
                        if (value != null && value.equals("true")) {
                            // مودال بسته شد
                        } else {
                            if (webView.canGoBack()) {
                                webView.goBack();
                            } else {
                                MainActivity.super.onBackPressed();
                            }
                        }
                    }
                }
            );
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}
