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
        Schema::create('seo_meta', function (Blueprint $table) {
            $table->id();
            $table->string('page', 50)->default('home')->unique();
            $table->string('meta_title', 70);
            $table->string('meta_description', 170);
            $table->foreignId('og_image_media_id')
                ->nullable()
                ->constrained('media')
                ->onDelete('restrict');
            $table->string('canonical_url', 255)->nullable();
            $table->string('person_job_title', 100)->nullable();
            $table->json('person_same_as')->nullable();
            $table->string('robots', 50)->default('index,follow');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seo_meta');
    }
};
