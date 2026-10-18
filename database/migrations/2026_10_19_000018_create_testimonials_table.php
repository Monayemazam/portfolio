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
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->text('quote');
            $table->string('author_name', 120);
            $table->string('author_role', 120)->nullable();
            $table->string('company', 150)->nullable();
            $table->foreignId('photo_media_id')
                ->nullable()
                ->constrained('media')
                ->onDelete('restrict');
            $table->foreignId('project_id')
                ->nullable()
                ->constrained('projects')
                ->onDelete('set null');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(false);
            $table->timestamps();

            $table->index(['is_published', 'sort_order']);
            $table->index('photo_media_id');
            $table->index('project_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
