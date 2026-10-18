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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title', 150);
            $table->string('slug', 160)->unique();
            $table->string('summary', 300);
            $table->text('description')->nullable();
            $table->string('business_type', 150)->nullable();
            $table->string('role', 150)->nullable();
            $table->unsignedSmallInteger('year')->nullable();
            $table->string('live_url', 255);
            $table->enum('planet_style', [
                'rocky',
                'station',
                'amber',
                'ringed',
                'ocean',
                'desert',
                'generic',
            ])->default('generic');
            $table->char('accent_color', 7)->nullable();
            $table->foreignId('cover_media_id')
                ->nullable()
                ->constrained('media')
                ->onDelete('restrict');
            $table->boolean('show_live_preview')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_published', 'deleted_at', 'sort_order']);
            $table->index('is_featured');
            $table->index('cover_media_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
