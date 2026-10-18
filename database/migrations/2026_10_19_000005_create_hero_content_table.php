<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hero_content', function (Blueprint $table) {
            $table->id();
            $table->string('eyebrow', 100)->nullable();
            $table->string('name', 150);
            $table->string('primary_button_label', 60);
            $table->string('primary_button_url', 255);
            $table->string('secondary_button_label', 60);
            $table->string('secondary_button_url', 255);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hero_content');
    }
};
